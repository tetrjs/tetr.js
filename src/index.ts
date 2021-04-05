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

import WebsocketManager from "./WebsocketManager";
import fetch from "node-fetch";

class EventEmitter {
  private events: EventEmitterEvent[] = [];

  /**
   * Emitted when an event occurs.
   * @returns {void}
   * @param {ClientEvent} event - The event to set it's function for.
   * @param {Function} func - The function to call when emitted.
   */
  public on(event: ClientEvent, func: Function): void {
    this.events.push({
      event,
      func,
    });
  }

  /**
   * Manually emit an event.
   * @returns {void}
   * @param {ClientEvent} event - The event to set it's function for.
   * @param {any} args - The function to call when emitted.
   */
  public emit(event: ClientEvent, args?: any): void {
    const array = this.events.filter((x) => x.event == event);

    array.forEach((element) => {
      if (args) element.func(args);
      else element.func();
    });
  }
}

interface EventEmitterEvent {
  event: string;
  func: Function;
}

/**
 * The main Client class.
 * @extends {EventEmitter}
 */
export class Client extends EventEmitter {
  private ws: WebsocketManager;

  /**
   * The client's token.
   * @type {string}
   */
  public token!: string;

  /**
   * The ClientUser object. All client-related methods and properties.
   * @type {ClientUser}
   */
  public user!: ClientUser;

  /**
   * The Room object. All room-related methods and properties.
   * @type {Room}
   */
  public room: Room;

  /**
   * @param {Handling} handling - The handling options that the client uses when connecting to the server.
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

    this.room = new Room(this.ws);
  }

  /**
   * Method to initiate the client.
   * @returns {void}
   * @param {string} token - The client's token.
   */

  public login(token: string): void {
    this.token = token;
    this.ws.connect();
  }

  /**
   * Get the client to join a room.
   * @returns {void}
   * @param {string} room - The room to join.
   */
  public joinRoom(room: string): void {
    if (this.room.id) {
      this.leaveRoom();
    }

    this.ws.send({ id: this.ws.messageID, command: "joinroom", data: room });

    this.room.id = room;
  }
  /**
   * Get the client to the leave the current room.
   * @returns {void}
   */
  public leaveRoom(): void {
    if (!this.room.id) return;

    this.ws.send({
      id: this.ws.messageID,
      command: "leaveroom",
      data: false,
    });

    this.room.id = undefined;
  }
  /**
   * Destroy the client and disconnect from the server.
   * @returns {void}
   */
  public destroy(): void {
    this.ws.disconnect();
  }
}

/**
 * The main User Class.
 */
export class User {
  /* Constructor */

  /**
   *
   * @param {string} id - ID of the user.
   */
  constructor(id: string) {
    this.getUser(id);
  }

  /* Methods */

  private async getUser(id: string): Promise<void> {
    const userData = await (
      await fetch(`https://ch.tetr.io/api/users/${id}`)
    ).json();

    if (!userData.success) throw userData.error;

    const user = userData.data.user;

    for (var key in user) {
      if (key != "_id" || "league") {
        // @ts-ignore
        this[key] = user[key];
      }
    }
  }

  /* Properties */

  /**
   * The user's ID.
   * @type {string}
   * @readonly
   */
  public id!: string;

  /**
   * The user's username.
   * @type {string}
   * @readonly
   */
  public username!: string;

  /**
   * The user's role.
   * @type {string}
   * @readonly
   */

  public role!: string;

  /**
   * The bot's owner. (If Applicable)
   * @type {?string}
   * @readonly
   */

  public botmaster?: string;

  /**
   * The user's badges.
   * @type {string[]}
   * @readonly
   */
  public badges!: string[];

  /**
   * The user's XP count.
   * @type {number}
   * @readonly
   */
  public xp!: number;

  /**
   * The amount of games the user has played.
   * @type {?number}
   * @readonly
   */
  public gamesplayed?: number;

  /**
   * The amount of games the user has won.
   * @type {?number}
   * @readonly
   */
  public gameswon?: number;

  /**
   *  How long the user has played.
   * @type {?number}
   * @readonly
   */
  public gametime?: number;

  /**
   * The country the player is from.
   * @type {?string}
   * @readonly
   */
  public country?: string;

  /**
   * Is the user a supporter?
   * @type {boolean}
   * @readonly
   */

  public supporter!: boolean;

  /**
   * The support tier.
   * @type {number}
   * @readonly
   */
  public supportertier!: number;

  /**
   * Is the user verified?
   * @type {boolean}
   * @readonly
   */
  public verified!: boolean;
}

/**
 * The Client User object.
 * @extends {User}
 */
export class ClientUser extends User {
  /* Constructor */

  /**
   * @constructor
   * @param {WebsocketManager} ws - WebSocket Manager
   * @param {string} id - Client user ID.
   */
  public constructor(private ws: WebsocketManager, public id: string) {
    super(id);
  }

  /* Methods */

  /**
   * Send a direct message to a user.
   * @returns {void}
   * @param {User} user - The user to send the message to.
   * @param {string} message - The message content.
   */
  public message(user: User, message: string): void {
    this.ws.send({
      command: "social.dm",
      data: { recipient: user.id, msg: message },
    });
  }

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
  }): void {
    this.ws.send({ command: "social.presence", data: options });
  }

  /**
   * Invite a user to join the client's session.
   * @returns {void}
   * @param {User} user - The user to invite.
   */
  public invite(user: User): void {
    this.ws.send({ command: "social.invite", data: user.id });
  }
}

export class Room {
  /* Constructor */

  public constructor(private ws: WebsocketManager) {}

  /* Properties */

  /**
   * The current room that the client is in.
   * @type {string} id -  The room ID.
   */
  public id?: string;

  /* Methods /

  /**
   * Send a message to the room.
   * @returns {void}
   * @param {string} msg - The message content.
   */
  public message(msg: string): void {
    this.ws.send({ id: this.ws.messageID, command: "chat", data: msg });
  }

  /**
   * Switch the client's mode.
   * @returns {void}
   * @param {"player" | "spectator"} mode - The mode to set.
   */
  public selfMode(mode: "player" | "spectator"): void {
    this.ws.send({
      id: this.ws.messageID,
      command: "switchbracket",
      data: mode,
    });
  }
  /**
   * Switch a user's mode.
   * @returns {void}
   * @param {User} user - The user's ID.
   * @param {"player" | "spectator"} mode - The mode to set.
   */
  public setMode(user: User, mode: "player" | "spectator"): void {
    this.ws.send({
      id: this.ws.messageID,
      command: "switchbrackethost",
      data: { uid: user.id, bracket: mode },
    });
  }

  /**
   * Update the room config.
   * @returns {void}
   * @param {{ index: string; value: any }[]} options - The configuration.
   */

  public setConfig(options: { index: string; value: any }[]): void {
    this.ws.send({
      id: this.ws.messageID,
      command: "updateconfig",
      data: options,
    });
  }
}

/**
 * The handlings options that the client uses when connecting to the server.
 * @param {string} arr - A float value in the range [1, 5] represented as a string. Represents automatic repeat rate.
 * @param {string} das - A float value in the range [1, 8] represented as a string. Represents delayed auto-shift.
 * @param {string} sdf - An integer value in the range [5, 41] represented as a string. Represents soft-drop factor, where 41 represents infinity.
 * @param {boolean} safelock - Represents the "prevent accidental hard drops" setting.
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

export type ClientEvent =
  | "ready"
  | "message"
  | "game_update"
  | "social_dm"
  | "social_invite"
  | "social_presence"
  | "start_multiplayer";
