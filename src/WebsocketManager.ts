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
import { Client, ClientUser, Room, User } from ".";
import { EventDM, EventInvite, EventMessage } from "./Events";
import fetch from "node-fetch";
import msgpack from "msgpack-lite";

export default class WebsocketManager {
  private socket!: WebSocket;
  private socketID!: string;
  private resumeID!: string;
  private sendHistory: any[] = [];
  private sendQueue: Buffer[] = [];
  private heartbeatTO?: NodeJS.Timeout;

  public messageID: number = 1;
  private serverID: number = 0;

  public constructor(private client: Client) {}

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

    this.client.user = new ClientUser(this, user.user._id);

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
      for (var i = 0; this.sendQueue.length; i++) {
        this.socket.send(this.sendQueue[i]);

        this.sendQueue.splice(i, 1);
      }

      this.send({
        command: "resume",
        socketid: this.socketID,
        resumetoken: this.resumeID,
      });

      this.send({
        command: "hello",
        packets: this.sendHistory,
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
      if (this.socket.OPEN) {
        try {
          this.socket.send(Buffer.from([0xb0, 0x0b]));
        } catch {
          this.heartbeat(200);
        }
      } else return this.heartbeat(200);
    }, ms);
  }

  send(payload: any): void {
    const buffer = msgpack.encode(payload);

    if (this.socket.OPEN) {
      this.socket.send(buffer);
    } else {
      this.sendQueue.push(buffer);
    }

    this.sendHistory.push(buffer);

    if (this.sendHistory.length > 500) {
      this.sendHistory.splice(0, this.sendHistory.length - 500);
    }

    if (payload.id) this.messageID = payload.id + 1;
  }

  async receive(
    e: MessageEvent | { data: Buffer },
    ws: WebsocketManager
  ): Promise<void> {
    var packet: Packet = {
      type: Number((e.data.slice(0, 1) as Buffer[])[0]),
      data: null,
    };

    switch (packet.type) {
      case 0x45: // Standard ID Tag
        packet.data = msgpack.decode(e.data.slice(1) as Buffer);
        break;
      case 0xae: // Extracted ID Tag
        packet.data = msgpack.decode(e.data.slice(5) as Buffer);
        packet.data.id = (e.data as Buffer).readUInt32BE(1);

        break;
      case 0x58: // Batch Tag
        var lengths = [];

        for (var i = 0; true; i++) {
          if ((e.data.slice(i * 4 + 1) as Buffer).readUInt32BE() === 0) break;

          lengths.push((e.data.slice(i * 4 + 1) as Buffer).readUInt32BE());
        }

        var pointer = 0;
        for (let i = 0; i < lengths.length; i++) {
          ws.receive(
            {
              data: e.data.slice(
                1 + lengths.length * 4 + 4 + pointer,
                1 + lengths.length * 4 + 4 + pointer + lengths[i]
              ) as Buffer,
            },
            ws
          );
          pointer += lengths[i];
        }
        return;
      case 0xb0: // Extension Tag
        if (
          Buffer.compare(e.data.slice(1) as Buffer, Buffer.from([0x0c])) === 0
        )
          ws.heartbeat(5000);

        return;
      default:
        packet.data = msgpack.decode(e.data as Buffer);
        packet.type = undefined;
    }

    if (!packet.data) return;

    if (packet.data.id && packet.data.id <= this.serverID) return;

    if (packet.data.id) this.serverID = packet.data.id;

    switch (packet.data.command) {
      case "hello":
        if (!ws.socketID || !ws.resumeID) {
          ws.socketID = packet.data.id;
          ws.resumeID = packet.data.resume;

          const file = await fetch("https://tetr.io/js/tetrio.js");
          const text = await file.text();
          const id = text.match(/"commit":{"id":"(.{7})"/);

          if (!id || !id[1]) throw "Unable to fetch commit ID.";

          ws.send({
            id: ws.messageID,
            command: "authorize",
            data: {
              token: ws.client.token,
              handling: ws.client.handling,
              signature: {
                commit: {
                  id: id[1],
                },
              },
            },
          });
        } else {
          for (var i = 0; i < packet.data.packets.length; i++) {
            if (
              !["authorize", "migrate"].includes(packet.data.packets[i].command)
            ) {
              var buf = Buffer.alloc(
                msgpack.encode(packet.data.packets[i]).length + 1
              );

              buf.set([0x45], 0);

              buf.set(msgpack.encode(packet.data.packets[i]), 1);

              ws.receive(
                {
                  data: buf,
                },
                ws
              );
            }
          }
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
        throw packet.data.reason;
      case "err":
        throw packet.data.data;
      case "error":
        throw packet.data.data;
      case "kick":
        throw packet.data.data.reason;
      case "chat":
        const message: EventMessage = {
          content: packet.data.data.content,
          user: await new User().getUser(packet.data.data.user._id),
          systemMessage: packet.data.data.system,
        };
        ws.client.emit("message", message);
        break;
      case "gmupdate":
        ws.client.room.options = packet.data.data.game.options;

        ws.client.room.players = [];

        for (var i = 0; i < packet.data.data.players.length; i++) {
          ws.client.room.players.push({
            mode: packet.data.data.players[i].bracket,
            user: await new User().getUser(packet.data.data.players[i]._id),
          });
        }

        ws.client.room.host = await new User().getUser(packet.data.data.owner);

        ws.client.room.gameStarted = packet.data.data.game.state === "ingame";

        ws.client.emit("options_update", packet.data.data.game.options);
        break;
      case "gmupdate.bracket":
        if (
          !ws.client.room.players.find(
            (u) => u.user.id === packet.data.data.uid
          )
        )
          return;

        // @ts-ignore
        ws.client.room.players.find(
          (u) => u.user.id === packet.data.data.uid
        ).mode = packet.data.data.bracket;

        ws.client.emit(
          "switch_mode",
          ws.client.room.players.find((u) => u.user.id === packet.data.data.uid)
        );
        break;
      case "gmupdate.host":
        var newHost = await new User().getUser(packet.data.data);

        ws.client.room.host = newHost;

        ws.client.emit("host_switch", newHost);
        break;
      case "gmupdate.join":
        var userJoin = await new User().getUser(packet.data.data._id);

        ws.client.room.players.push({
          mode: packet.data.data.bracket,
          user: userJoin,
        });

        ws.client.emit("player_join", userJoin);
        break;
      case "gmupdate.leave":
        var userLeave = await new User().getUser(packet.data.data);

        ws.client.room.players.splice(
          ws.client.room.players.indexOf(
            // @ts-ignore
            ws.client.room.players.find((u) => u.user.id === packet.data.data)
          ),
          1
        );

        ws.client.emit("player_leave", userLeave);
        break;
      case "social.dm":
        const dm: EventDM = {
          content: packet.data.data.data.content,
          user: packet.data.data.data.system
            ? undefined
            : await new User().getUser(packet.data.data.data.user),
          system: packet.data.data.data.system,
          timestamp: packet.data.data.ts,
        };
        ws.client.emit("social_dm", dm);
        break;
      case "social.invite":
        const invite: EventInvite = {
          room: packet.data.data.roomid,
          author: await new User().getUser(packet.data.data.sender),
        };
        ws.client.emit("social_invite", invite);
        break;
      case "social.presence":
        ws.client.emit("social_presence", packet.data.data);
        break;
      case "startmulti":
        ws.client.room.gameStarted = true;

        ws.client.emit("room_start");
        break;
      case "endmulti":
        ws.client.room.gameStarted = false;

        ws.client.emit("room_end");
        break;
      case "joinroom":
        ws.client.emit("join");
        break;
      case "leaveroom":
        this.client.room = new Room(this);

        ws.client.emit("leave");
        break;
    }
  }

  public disconnect(): void {
    this.send({ command: "die" });
    this.socket.close();
  }
}

interface Packet {
  type?: Number;
  data: any;
}
