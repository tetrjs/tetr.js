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
/**
 * @param {Handling} handling - TETR.IO handling settings.
 */
export default class Client extends EventEmitter {
  // https://nodejs.dev/learn/the-nodejs-event-emitter
  private ws: WebsocketManager;
  private roomID!: string;

  public token!: string;
  public social: object = {
    message: this._socialDM.bind(this),
    invite: this._socialInvite.bind(this),
    presence: this._socialPresence.bind(this),
  };
  public room: object = {
    join: this.join.bind(this),
    leave: this.leave.bind(this),
    mode: this.mode.bind(this),
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
    if (!this.roomID) throw new Error("Client is not in a invitable lobby!");
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
   * @param {string} room - Room ID.
   */
  private join(r: string): void {
    this.ws.send({ id: this.ws.id, command: "joinroom", data: r });
  }

  /**
   * @param {string} presence - Room ID.
   */
  private leave(): void {
    this.ws.send({ id: this.ws.id, command: "leaveroom", data: false });
  }

  /**
   * @param {string} mode - Mode.
   */
  private mode(mode: "player" | "special"): void {
    this.ws.send({ id: this.ws.id, command: "switchbracket", data: mode });
  }
}
