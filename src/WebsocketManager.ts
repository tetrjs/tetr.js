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

import WebSocket, { ErrorEvent, MessageEvent } from "ws";
import { Client } from ".";
import { EventDM, EventInvite, EventMessage } from "./Events";
import fetch from "node-fetch";
import msgpack from "msgpack-lite";

export default class WebsocketManager {
  private client!: Client;
  private socket!: WebSocket;
  private socketID!: string;
  private resumeID!: string;
  private bufferHistory: Buffer[] = [];
  private lastRecalculation: number = 0;
  private cacheSize: number = 0;
  private heartbeatTO?: NodeJS.Timeout;

  public messageID: number = 1;

  public constructor(client: Client) {
    this.client = client;
  }

  public async connect(): Promise<void> {
    const user = await (
      await fetch("https://tetr.io/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${this.client.token}` },
      })
    ).json();

    if (!user.success) {
      throw "Invalid Token.";
    }

    if (user.user.role !== "bot")
      throw "Client is not a bot. Apply for a bot account by messaging osk#9999 on Discord.";

    this.socket = new WebSocket("wss://tetr.io/ribbon");

    this.socket.onopen = () => {
      this.send({ command: "new" });

      this.heartbeatTO = this.heartbeat(5000);
    };

    this.socket.onerror = (e: ErrorEvent) => {
      throw e.message;
    };

    this.socket.onmessage = (e) => {
      this.receive(e, this);
    };
  }

  migrate(endpoint: string): void {
    if (this.socket) this.socket.close();

    if (this.heartbeatTO) clearTimeout(this.heartbeatTO);

    this.socket = new WebSocket(endpoint);

    this.socket.onopen = () => {
      this.send({
        command: "resume",
        socketid: this.socketID,
        resumetoken: this.resumeID,
      });

      if (this.messageID % 100 == 0) {
        var messagesPerSecond =
          1000 /
          (!this.lastRecalculation
            ? 1
            : (Date.now() - this.lastRecalculation) / 1000) /
          100;
        this.cacheSize = Math.max(100, Math.min(30 * messagesPerSecond, 2000));
      }

      this.send({
        command: "hello",
        packets: this.bufferHistory.slice(
          this.bufferHistory.length - this.cacheSize,
          this.bufferHistory.length
        ),
      });

      this.heartbeatTO = this.heartbeat(5000);

      this.socket.onerror = (e: ErrorEvent) => {
        throw e.message;
      };

      this.socket.onmessage = (e) => {
        this.receive(e, this);
      };
    };
  }

  heartbeat(ms: number): NodeJS.Timeout {
    return setTimeout(() => {
      if (this.socket.OPEN) this.socket.send(Buffer.from([0xb0, 0x0b]));
    }, ms);
  }

  send(payload: any): void {
    const buffer = msgpack.encode(payload);
    if (this.socket.OPEN) this.socket.send(buffer);
    this.bufferHistory.push(buffer);
  }

  receive(e: MessageEvent, ws: WebsocketManager): void {
    var packet: Packet = {
      type: Number((e.data.slice(0, 1) as Buffer[])[0]),
      data: null,
    };

    switch (packet.type) {
      case 0x45: // Standard ID Tag
        packet.data = msgpack.decode(e.data.slice(1) as Buffer);
        break;
      case 0xae: // Extracted ID Tag
        packet.id = 174;
        packet.data = msgpack.decode(e.data.slice(5) as Buffer);
        break;
      case 0x58: // Batch Tag
        packet.lengths = 4;
        packet.data = msgpack.decode(e.data.slice(1) as Buffer);
        break;
      case 0xb0: // Extension Tag
        packet.data = e.data.slice(1);

        if (Buffer.compare(packet.data as Buffer, Buffer.from([0x0c])) === 0)
          ws.heartbeat(5000);

        return;
    }

    if (packet.data.id) ws.messageID = packet.data.id + 1;

    switch (packet.data.command) {
      case "hello":
        if (!ws.socketID || !ws.resumeID) {
          ws.socketID = packet.data.id;
          ws.resumeID = packet.data.resume;

          ws.send({
            id: ws.messageID,
            command: "authorize",
            data: {
              token: ws.client.token,
              handling: ws.client.handling,
              signature: { commit: { id: "2d05c95" } },
            },
          });
        }

        break;
      case "authorize":
        ws.send({
          command: "social.presence",
          data: { status: "online", detail: "" },
        });

        ws.client.emit("ready");
        break;
      case "migrate":
        ws.migrate(packet.data.data.endpoint);
        break;
      case "nope":
        console.error(packet.data.reason);
        break;
      case "error":
        console.error(packet.data.data);
        break;
      case "kick":
        console.error(packet.data.data.reason);
        break;
      case "chat":
        const message: EventMessage = {
          content: packet.data.data.content,
          author: packet.data.data.user._id,
          systemMessage: packet.data.data.system,
        };
        ws.client.emit("message", message);
        break;
      case "gmupdate":
        ws.client.emit("game_update", packet.data.data.game.options);
        break;
      case "social.dm":
        const dm: EventDM = {
          content: packet.data.data.data.content,
          author: packet.data.data.data.system
            ? undefined
            : packet.data.data.data.user,
          system: packet.data.data.data.system,
          timestamp: packet.data.data.ts,
        };
        ws.client.emit("social_dm", dm);
        break;
      case "social.invite":
        const invite: EventInvite = {
          room: packet.data.data.roomid,
          author: packet.data.data.sender,
        };
        ws.client.emit("social_invite", invite);
        break;
      case "social.presence":
        ws.client.emit("social_presence", packet.data.data);
        break;
      case "startmulti":
        ws.client.emit("start_multiplayer");
        break;
    }
  }

  public disconnect(): void {
    this.send({ command: "die" });
    this.socket.close();
  }
}

interface Packet {
  type: Number;
  data: any;
  id?: number;
  lengths?: number;
}
