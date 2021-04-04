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

  export class EventEmitter {
    /* Methods */

    /**
     * Emitted when an event occurs.
     * @returns {void}
     * @param {ClientEvent} event - The event to set it's function for.
     * @param {Function} func - The function to call when emitted.
     */
    public on(event: ClientEvent, func: Function): void;

    /**
     * Manually emit an event.
     * @returns {void}
     * @param {ClientEvent} event - The event to set it's function for.
     * @param {any} args - The function to call when emitted.
     */
    public emit(event: ClientEvent, args?: any): void;
  }

  export interface EventMessage {
    content: string;
    author: string;
    systemMessage: boolean;
  }

  export interface EventDM {
    content: string;
    author: string;
    system: boolean;
    timestamp: string;
  }

  export interface EventInvite {
    room: string;
    author: string;
  }

  export class Client extends EventEmitter {
    /* Properties */

    /**
     * The client's token.
     * @type {string}
     */
    public token: string;

    /**
     * The ClientUser object. All client-related methods and properties.
     * @type {ClientUser}
     */
    public user: ClientUser;

    /**
     * The Room object. All room-related methods and properties.
     * @type {Room}
     */
    public room: Room;

    /* Constructor */

    /**
     * The handling options that the client uses when connecting to the server.
     * @type {Handling}
     */
    public handling: Handling;

    /**
     * The handlings options that the client uses when connecting to the server.
     * @constructor
     * @param {Handling} handling
     */
    public constructor(handling: Handling);

    /* Methods */

    /**
     * Method to initiate the client.
     * @returns {void}
     * @param {string} token - The client's token.
     */
    public login(token: string): void;

    /**
     * Get the client to join a room.
     * @returns {void}
     * @param {string} room - The room to join.
     */
    public joinRoom(room: string): void;
    /**
     * Get the client to the leave the current room.
     * @returns {void}
     */
    public leaveRoom(): void;
    /**
     * Destroy the client and disconnect from the server.
     * @returns {void}
     */
    public destroy(): void;
  }

  export class ClientUser {
    /* Methods */

    /**
     * Send a direct message to a user.
     * @returns {void}
     * @param {string} user - The user to send the message to.
     * @param {string} message - The message content.
     */
    public message(user: string, message: string): void;

    /**
     * Set the client's presence.
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
     * Invite a user to join the client's session.
     * @returns {void}
     * @param {string} user - The user to invite.
     */
    public invite(user: string): void;
  }

  export class Room {
    /* Properties */

    /**
     * The current room that the client is in.
     * @type {string}
     */
    public id?: string;

    /* Methods */

    /**
     * Send a message to the room.
     * @returns {void}
     * @param {string} msg - The message content.
     */
    public message(msg: string): void;

    /**
     * Switch the client's mode.
     * @returns {void}
     * @param {"player" | "spectator"} mode - The mode to set.
     */
    public selfMode(mode: "player" | "spectator"): void;

    /**
     * Switch a user's mode.
     * @returns {void}
     * @param {string} user - The user's ID.
     * @param {"player" | "spectator"} mode - The mode to set.
     */
    public setMode(user: string, mode: "player" | "spectator"): void;

    /**
     * Update the room config.
     * @returns {void}
     * @param {{ index: string; value: any }[]} options - The configuration.
     */
    public setConfig(options: { index: string; value: any }[]): void;
  }

  /**
   * The handlings options that the client uses when connecting to the server.
   * @prop {string} arr - A float value in the range [1, 5] represented as a string. Represents automatic repeat rate.
   * @prop {string} das - A float value in the range [1, 8] represented as a string. Represents delayed auto-shift.
   * @prop {string} sdf - An integer value in the range [5, 41] represented as a string. Represents soft-drop factor, where 41 represents infinity.
   * @prop {boolean} safelock - Represents the "prevent accidental hard drops" setting.
   */
  export interface Handling {
    /**
     * A float value in the range [1, 5] represented as a string. Represents automatic repeat rate.
     * @type {string}
     */
    arr: string;
    /**
     * A float value in the range [1, 8] represented as a string. Represents delayed auto-shift.
     * @type {string}
     */
    das: string;
    /**
     * An integer value in the range [5, 41] represented as a string. Represents soft-drop factor, where 41 represents infinity.
     * @type {string}
     */
    sdf: string;
    /**
     * Represents the "prevent accidental hard drops" setting.
     * @type {boolean}
     */
    safelock: boolean;
  }
}
