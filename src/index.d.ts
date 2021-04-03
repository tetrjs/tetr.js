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
declare module "tetr.js" {
  export type ClientEvent =
    | "ready"
    | "message"
    | "game_update"
    | "social_dm"
    | "social_invite"
    | "social_presence"
    | "start_multiplayer";

  export class Client {
    /* Properties */

    /**
     * @type {string} token - The client's token.
     */
    public token: string;

    /**
     * @type {ClientUser} user - The client's user.
     */
    public user: ClientUser;

    /**
     * @type {Room} - The client's current room.
     */
    public room: Room;

    /* Constructor */

    /**
     * @type {Handling} handling - The client's settings.
     */
    public handling: Handling;

    /**
     * @constructor
     * @param {Handling} handling - The client's settings.
     */
    public constructor(handling: Handling);

    /* Methods */

    /**
     * @returns {void}
     * @param {string} token - The client's token.
     */
    public login(token: string): void;

    /**
     * @returns {void}
     * @param {Event} event - The event to set it's function for.
     * @param {Function} func - The function to call when emitted.
     */
    public on(event: ClientEvent, func: Function): void;

    /**
     * @returns {void}
     * @param {string} room - The room to join.
     */
    public joinRoom(room: string): void;
    /**
     * @returns {void}
     */
    public leaveRoom(): void;
    /**
     * @returns {void}
     */
    public destroy(): void;
  }

  export class ClientUser {
    /* Constructor */
    public id: string;

    /**
     * @constructor
     * @param {string} id - The client's ID.
     */
    public constructor(id: string);

    /* Methods */
    /**
     * @returns {void}
     * @param {string} user - The user to send the message to.
     * @param {string} message - The message content.
     */
    public message(user: string, message: string): void;

    /**
     * @returns {void}
     * @param {"online" | "away" | "busy" | "invisible"} status - The type of presence.
     * @param {string} message - The presence details.
     */
    public setPresence(options: {
      status: "online" | "away" | "busy" | "invisible";
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
    }): void;

    /**
     * @returns {void}
     * @param {string} user - The user to invite.
     */
    public invite(user: string): void;
  }

  export interface Handling {
    arr: string;
    das: string;
    sdf: string;
    safelock: boolean;
  }

  export class Room {
    /* Properties */

    /**
     * @type {string} id -  The room ID.
     */
    public id?: string;

    /* Methods */

    /**
     * @returns {void}
     * @param {string} msg - The message content.
     */
    public message(msg: string): void;

    /**
     * @returns {void}
     * @param {"player" | "spectator"} mode - The mode to set.
     */
    public selfMode(mode: "player" | "spectator"): void;

    /**
     * @returns {void}
     * @param {string} user - The user's ID.
     * @param {"player" | "spectator"} mode - The mode to set.
     */
    public setMode(user: string, mode: "player" | "spectator"): void;

    /**
     * @returns {void}
     * @param {{ index: string; value: any }[]} options - The configuration.
     */
    public setConfig(options: { index: string; value: any }[]): void;
  }
}
