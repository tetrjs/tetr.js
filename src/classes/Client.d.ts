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
export class Client {
  /**
   * @type {string} - Client token.
   */
  public token: string;

  public social: ClientSocial;
  public room: ClientRoom;

  /**
   * @param {string} token - Token of the client.
   */
  public login(token: string): void;
  /**
   * @param {Event} event - Event to assign function to.
   * @param {Function} func - Event to emit.
   */
  public on(event: Event, func: Function): void;
}

interface Handling {
  /**
   * @param {string} arr - FLOAT [1-5]. Represents automatic repeat rate.
   * @param {string} das - FLOAT [1-8]. Represents delayed auto-shift.
   * @param {string} sdf - INT [5-41]. Represents soft-drop factor, where 41 represents infinity.
   * @param {boolean} safelock - Represents the "prevent accidental hard drops" setting.
   */
  arr: string;
  das: string;
  sdf: string;
  safelock: boolean;
}

interface ClientRoom {
  /**
   * @return {void}
   * @param {string} r - Room ID.
   */
  join(r: string): void;
  leave(): void;

  /**
   * @return {void}
   * @param {Mode} mode - Mode.
   */
  selfMode(mode: Mode): void;
  /**
   * @return {void}
   * @param {string} user - User to set.
   * @param {Mode} mode - Mode to set user.
   */
  setMode(user: string, mode: Mode): void;
  /**
   * @return {void}
   * @param {GameOptions} options - Options to change in the room.
   */
  updateSettings(options: { index: string; value: any }[]): void;
  /**
   * @return {void}
   * @param {string} message - Content of the message.
   */
  message(message: string): void;
  id?: string;
}

interface ClientSocial {
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   * @param {string} msg - Content of the message.
   */
  message(recipient: string, msg: string): void;
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   */
  invite(recipient: string): void;
  /**
   * @return {void}
   * @param {Presence} presence - Presence of the client.
   */
  presence(presence: Presence): void;
}

export type Presence = {
  status: "online" | "away" | "busy" | "offline";
  detail:
    | ""
    | "menus"
    | "40l"
    | "blitz"
    | "zen"
    | "custom"
    | "lobby_end:X-QP"
    | "lobby_spec:X-QP"
    | "lobby_ig:X-QP"
    | "lobby:X-QP"
    | "lobby_end:X-PRIV"
    | "lobby_spec:X-PRIV"
    | "lobby_ig:X-PRIV"
    | "lobby:X-PRIV"
    | "tl_mn"
    | "tl"
    | "tl_end"
    | "tl_mn_complete"
    | string;
  user?: string;
  invitable?: boolean;
};

export type Event =
  | "authorize"
  | "chat"
  | "gmupdate"
  | "joinroom"
  | "leaveroom"
  | "readymulti"
  | "refereeboard"
  | "replay"
  | "social.dm"
  | "social.invite"
  | "social.presence"
  | "social.notifcation"
  | "social.online"
  | "startmulti";

export type Mode = "player" | "spectator";
