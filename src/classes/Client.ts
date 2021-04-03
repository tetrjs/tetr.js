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

import WebsocketManager, { Handling } from "../ws/WebsocketManager";
import * as Payloads from "../interfaces/Payloads";
import EventEmitter from "events";

export class Client extends EventEmitter {
  // https://nodejs.dev/learn/the-nodejs-event-emitter
  private ws: WebsocketManager;
  private roomID!: string;

  public token!: string;
  public social: ClientSocial = {
    message: this._socialDM.bind(this),
    invite: this._socialInvite.bind(this),
    presence: this._socialPresence.bind(this),
  };
  public room: ClientRoom = {
    join: this._join.bind(this),
    leave: this._leave.bind(this),
    selfMode: this._switchBracket.bind(this),
    setMode: this._switchBracketHost.bind(this),
    updateSettings: this._updateConfig.bind(this),
    message: this._chat.bind(this),
  };

  /**
   * @constructor
   * @param {Handling} handling - TETR.IO handling settings.
   */
  public constructor(
    public handling: Handling = {
      arr: "1",
      das: "1",
      sdf: "5",
      safelock: true,
    }
  ) {
    super();

    this.ws = new WebsocketManager(this);
  }

  /**
   * @param {string} token - Token of the client.
   */
  public login(token: string): void {
    this.token = token;
    this.ws.connect();
  }

  /**
   * @param {string} recipient - The recipient's ID.
   * @param {string} msg - Content of the message.
   */

  private _socialDM(recipient: string, msg: string): void {
    this.ws.send({ command: "social.dm", data: { recipient, msg } });
  }

  /**
   * @param {string} recipient - The recipient's ID.
   */
  private _socialInvite(recipient: string): void {
    if (!this.roomID) throw new Error("Client is not in a inevitable lobby!");
    if (!this.ws) throw new Error("test");

    this.ws.send({ command: "social.invite", data: recipient });
  }

  /**
   * @param {Payloads.Presence} presence - Presence of the client.
   */
  private _socialPresence(presence: Payloads.Presence): void {
    this.ws.send({ command: "social.presence", data: presence });
  }

  /**
   * @param {string} r - Room ID.
   */
  private _join(r: string): void {
    this.ws.send({ id: this.ws.id, command: "joinroom", data: r });
    this.room.id = r;
  }

  private _leave(): void {
    this.ws.send({ id: this.ws.id, command: "leaveroom", data: false });
    this.room.id = undefined;
  }

  /**
   * @param {string} mode - Mode.
   */
  private _switchBracket(mode: "player" | "spectator"): void {
    this.ws.send({ id: this.ws.id, command: "switchbracket", data: mode });
  }

  private _switchBracketHost(user: string, mode: "player" | "spectator"): void {
    this.ws.send({
      id: this.ws.id,
      command: "switchbrackethost",
      data: { uid: user, bracket: mode },
    });
  }

  private _updateConfig(options: { index: string; value: any }[]): void {
    this.ws.send({ id: this.ws.id, command: "updateconfig", data: options });
  }

  private _chat(message: string): void {
    this.ws.send({ id: this.ws.id, command: "chat", data: message });
  }
}

interface ClientRoom {
  join(r: string): void;
  leave(): void;
  selfMode(mode: "player" | "spectator"): void;
  setMode(user: string, mode: "player" | "spectator"): void;
  updateSettings(options: { index: string; value: any }[]): void;
  message(message: string): void;
  id?: string;
}

interface ClientSocial {
  message(recipient: string, msg: string): void;
  invite(recipient: string): void;
  presence(presence: Payloads.Presence): void;
}
