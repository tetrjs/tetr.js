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
import EventEmitter from "events";
import { EventDM, EventInvite, EventMessage } from "./Events";

export declare interface Client {
  on(event: "ready", listener: () => void): this;
  on(event: "message", listener: (message: EventMessage) => void): this;
  on(
    event: "options_update",
    listener: (options: { key: string; value: any }[]) => void
  ): this;
  on(
    event: "switch_mode",
    listener: (player: { mode: "player" | "spectator"; user: User }) => void
  ): this;
  on(event: "host_switch", listener: (newHost: User) => void): this;
  on(event: "player_join", listener: (user: User) => void): this;
  on(event: "player_leave", listener: (user: User) => void): this;
  on(event: "social_dm", listener: (message: EventDM) => void): this;
  on(event: "social_invite", listener: (invite: EventInvite) => void): this;
  on(event: "room_start", listener: () => void): this;
  on(event: "room_end", listener: () => void): this;
  on(event: "join", listener: () => void): this;
  on(event: "leave", listener: () => void): this;
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
   * @readonly
   */
  public token!: string;

  /**
   * The ClientUser object. All client-related methods and properties.
   * @type {ClientUser}
   * @readonly
   */
  public user!: ClientUser;

  /**
   * The Room object. All room-related methods and properties.
   * @type {Room}
   * @readonly
   */
  public room: Room;

  /**
   * @param {Handling} handling - The handling options that the client uses when connecting to the server.
   */
  public constructor() {
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
   * Create a new custom room.
   * @param type
   */
  public createRoom(type: "private" | "public") {
    this.ws.send({ id: this.ws.messageID, command: "createroom", data: type });
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
   * @constructor
   * @param {?string} id
   * @param {?WebsocketManager} ws
   */
  public constructor(id?: string, ws?: WebsocketManager) {
    if (id && ws) this.getUser(id, ws);
  }

  /* Methods */

  /**
   * Send a direct message to a user.
   * @returns {void}
   * @param {string} message - The message content.
   */
  public message(message: string): void {
    this.ws.send({
      command: "social.dm",
      data: { recipient: this.id, msg: message },
    });
  }

  /**
   * Fetch a user and fill the User object.
   * @param {string} id - User ID.
   * @returns {Promise<User>}
   */
  public async getUser(id: string, ws: WebsocketManager): Promise<User> {
    const userData = await (
      await fetch(`https://ch.tetr.io/api/users/${id}`)
    ).json();

    if (!userData.success) throw userData.error;

    this.ws = ws;

    const user = userData.data.user;

    for (var key in user) {
      if (!["_id", "league", "botmaster"].includes(key)) {
        // @ts-ignore
        this[key] = user[key];

        if (key === "username") this.username = user.username.toUpperCase();
      }

      if (key === "botmaster") {
        this.botmaster = [];

        var mastUsers = user.botmaster.split(", ");

        for (var i = 0; i < mastUsers.length; i++) {
          this.botmaster.push(await new User().getUser(mastUsers[i], this.ws));
        }
      }

      if (key === "_id") {
        this.id = user._id;
      }
    }

    return this;
  }

  /* Properties */

  private ws!: WebsocketManager;

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
   * @type {?User[]}
   * @readonly
   */

  public botmaster?: User[];

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
  /* Properties */
  private wsM!: WebsocketManager;
  private client!: Client;

  /* Constructor */

  /**
   * @constructor
   * @param {string} id - Client user ID.
   * @param {WebsocketManager} ws - WebSocket Manager
   */
  public constructor(public id: string, ws: WebsocketManager, c: Client) {
    super(id, ws);

    this.wsM = ws;
    this.client = c;
  }

  /* Methods */

  /**
   * Set the client user's handling settings.
   * @returns {void}
   * @param {Handling} handling - The handling options you want to set.
   */
  public setHandling(handling: Handling): void {
    this.wsM.send({
      id: this.wsM.messageID,
      command: "sethandling",
      data: {
        arr: handling.arr,
        das: handling.das,
        dcd: 0,
        sdf: handling.sdf,
        safelock: handling.safelock,
        cancel: false,
      },
    });
  }

  /**
   * Set the client user's privacy settings.
   * @returns {void}
   * @param {privacyOptions} options - The privacy options you want to set.
   */
  public async setPrivacy(options: privacyOptions): Promise<void> {
    await fetch("https://tetr.io/api/users/setPreferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.client.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
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
    this.wsM.send({ command: "social.presence", data: options });
  }

  /**
   * Invite a user to join the client's session.
   * @returns {void}
   * @param {User} user - The user to invite.
   */
  public invite(user: User): void {
    this.wsM.send({ command: "social.invite", data: user.id });
  }
}

export class Room {
  /* Constructor */

  public constructor(private ws: WebsocketManager) {}

  /* Properties */

  /**
   * The current room that the client is in.
   * @type {string} id -  The room ID.
   * @readonly
   */
  public id!: string;

  /**
   * The current room settings.
   * @type {object[]}
   * @readonly
   */
  public options: { key: string; value: any }[] = [];

  /**
   * The users that are connected to the room and their mode.
   * @type {object[]}
   * @readonly
   */
  public players: { mode: "player" | "spectator"; user: User }[] = [];

  /**
   * Whether or not the current room is mid-game.
   * @type {boolean}
   * @readonly
   */
  public gameStarted: boolean = false;

  /**
   * Host of the room.
   * @type {User}
   * @readonly
   */
  public host!: User;

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
   * Start the room.
   * @returns {void}
   */
  public startRoom(): void {
    this.ws.send({ id: this.ws.messageID, command: "startroom" });
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
 * The handlings options that the client uses to change handling.
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

/**
 * The privacy options that the client uses when changing their privacy settings.
 */
export interface privacyOptions {
  privacy_dm: "everyone" | "friends" | "nobody";
  privacy_invite: "everyone" | "friends" | "nobody";
  privatemode: "public" | "private";
  privacy_showcountry: boolean;
  privacy_showgametime: boolean;
  privacy_showplayed: boolean;
  privacy_showwon: boolean;
  privacy_status_deep: "everyone" | "friends" | "nobody";
  privacy_status_exact: "everyone" | "friends" | "nobody";
  privacy_status_shallow: "everyone" | "friends" | "nobody";
}
