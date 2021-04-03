/*
MIT License
Copyright (c) 2021 Jakob de Guzman
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Client } from "../classes/Client";
import { Constants } from "../constants/Constants";
import * as Payloads from "../interfaces/Payloads";

import WebSocket, { MessageEvent } from "ws";
import msgpack from "msgpack-lite";

export default class WebsocketManager {
  private socket!: WebSocket;
  public id: number = 1;
  private socketID!: string;
  private resumeID!: string;
  private heartbeatTimeout?: NodeJS.Timeout;
  private messageHistory: Buffer[] = [];
  private lastRecalculation?: number;
  private cacheSize: number = 0;

  constructor(private client: Client) {}

  private async reconnect(endpoint: string): Promise<void> {
    if (this.socket) this.socket.close();

    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.socket = new WebSocket(endpoint);
    this.socket.onopen = () => {
      const resume: Payloads.Resume = {
        command: "resume",
        socketid: this.socketID,
        resumetoken: this.resumeID,
      };

      this.send(resume);

      if (this.id % 100 == 0) {
        var messagesPerSecond =
          1000 /
          (!this.lastRecalculation
            ? 1
            : (Date.now() - this.lastRecalculation) / 1000) /
          100;
        this.cacheSize = Math.max(100, Math.min(30 * messagesPerSecond, 2000));
      }

      const hello: Payloads.Hello = {
        command: "hello",
        packets: this.messageHistory.slice(
          this.messageHistory.length - this.cacheSize,
          this.messageHistory.length
        ),
      };

      this.send(hello);

      this.heartbeatTimeout = this.heartbeat(5000);

      this.socket.onerror = (e: WebSocket.ErrorEvent) => {
        throw new Error(e.message);
      };

      const client = this.client;

      this.socket.onmessage = (e) => {
        this.receive(e, client);
      };
    };
  }

  async connect(): Promise<void> {
    try {
      this.socket = new WebSocket(Constants.GATEWAY);

      this.socket.onopen = () => {
        const payload: Payloads.New = {
          command: "new",
        };

        this.send(payload);

        this.heartbeatTimeout = this.heartbeat(5000);
      };

      this.socket.onerror = (e: WebSocket.ErrorEvent) => {
        throw new Error(e.message);
      };

      const client = this.client;

      this.socket.onmessage = (e) => {
        this.receive(e, client);
      };
    } catch (e) {
      console.error(e);
    }
  }

  private receive(e: MessageEvent, client: Client): void {
    let packet: Payloads.Payload = { type: 0x00, data: null };

    switch (Number((e.data.slice(0, 1) as Buffer[])[0])) {
      case 0x45: // Standard ID Tag
        packet = {
          type: 0x45,
          data: msgpack.decode(e.data.slice(1) as Buffer),
        };
        break;
      case 0xae: // Extracted ID Tag
        packet = {
          type: 0xae,
          id: 174,
          data: msgpack.decode(e.data.slice(5) as Buffer),
        };
        break;
      case 0x58: // Batch Tag
        packet = {
          type: 0x45,
          lengths: 4, // N Lengths uint32
          data: msgpack.decode(e.data.slice(1) as Buffer),
        };
        break;
      case 0xb0: // Extension Tag
        packet = { type: 0xb0, data: e.data.slice(1) };

        if (Buffer.compare(packet.data as Buffer, Buffer.from([0x0c])) === 0)
          this.heartbeat(5000);

        return;
    }

    if (packet.data.id) this.id = packet.data.id + 1;

    switch (packet.data.command) {
      case "hello":
        if (!this.socketID || !this.resumeID) {
          this.socketID = packet.data.id;
          this.resumeID = packet.data.resume;
          this.identify(client.token, client.handling);
        }
        break;
      case "authorize":
        const presenceData: Payloads.Presence = {
          status: "online",
          detail: "",
        };
        const presenceChange: Payloads.SocialPresence = {
          command: "social.presence",
          data: presenceData,
        };

        this.send(presenceChange);

        break;
      case "migrate":
        this.reconnect(packet.data.data.endpoint);
        break;
      case "nope":
        console.error(
          `${packet.data.command.toUpperCase()}: ${packet.data.reason}`
        );
        break;
      case "error":
        console.error(
          `${packet.data.command.toUpperCase()}: ${packet.data.data}`
        );
        break;
      case "kick":
        console.error(
          `${packet.data.command.toUpperCase()}: ${packet.data.data.reason}`
        );
        break;
    }

    if (
      ![
        "Buffer",
        "error",
        "hello",
        "ige",
        "migrate",
        "migrated",
        "nope",
        "ok",
      ].includes(packet.data.command)
    )
      client.emit(
        packet.data.command,
        packet.data.data as {
          type: number;
          data: any;
          id?: number;
          lengths?: number;
        }
      );
  }

  public send(msg: any): void {
    try {
      const buffer = msgpack.encode(msg);
      if (this.socket.OPEN) this.socket.send(buffer);
      this.messageHistory.push(buffer);
    } catch (e) {
      console.error(e);
    }
  }

  private heartbeat(ms: number): NodeJS.Timeout {
    return setTimeout(() => {
      const heartbeat = Buffer.from([0xb0, 0x0b]);
      if (this.socket.OPEN) this.socket.send(heartbeat); // Heartbeat payload
    }, ms);
  }

  private identify(token: string, handling: Handling): void {
    const identity: Payloads.Authorize = {
      id: this.id,
      command: "authorize",
      data: {
        token,
        handling,
        signature: { commit: { id: "2d05c95" } },
      },
    };

    this.send(identity);
  }
}

export interface Handling {
  arr: string;
  das: string;
  sdf: string;
  safelock: boolean;
}
