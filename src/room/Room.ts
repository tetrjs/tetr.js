import EventEmitter from "events";
import { Client, Config, Handling } from "..";
import User from "../user/User";

export default class Room extends EventEmitter {
  constructor(gmupdateData: Object, client: Client) {
    super();

    this.client = client;

    this.patch(gmupdateData, true);
  }

  // Variables

  /**
   * The Client Class
   * @type {Client}
   */
  private client!: Client;

  /**
   * The data from the gmupdate event
   * @type {any}
   */
  public raw: any = {};

  /**
   * The Room ID
   * @type {string}
   */
  public id: string = "";

  /**
   * Whether or not the room is discoverable
   * @type {string}
   */
  public type!: "public" | "private";

  /**
   * The players that are currently in the lobby
   * @type {Array}
   */
  public players: { bracket: "playing" | "spectator"; user: User }[] = [];

  /**
   * If the room has been started
   * @type {boolean}
   */
  public inGame: boolean = false;

  /**
   * The config of the Room
   * @type {Config}
   */
  public config: Config = {};

  /**
   * The owner of the Room
   * @type {User}
   */
  public owner!: User;

  // Functions

  /**
   * Sends a message in the Room
   * @param {string} content - The message to send in the room
   * @returns {void}
   */
  public send(content: string): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "chat",
      data: content,
    });
  }

  /**
   * Switches either your or another player's bracket
   * @param {"player" | "spectator"} bracket - The new bracket to be switched to
   * @param {User | undefined} player - The target player
   * @returns {void}
   */
  public switchBracket(bracket: "player" | "spectator", player?: User): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: player ? "switchbrackethost" : "switchbracket",
      data: player ? { uid: player._id, bracket } : bracket,
    });
  }

  /**
   * Update the current Room's config
   * @param {any} changes - The changes to be made
   * @returns {void}
   */
  public updateConfig(changes: { index: string; value: any }[]): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "updateconfig",
      data: changes,
    });
  }

  /**
   * Kicks a play from the Room
   * @param {User} user - The User to kick from the room
   * @returns {void}
   */
  public kick(user: User): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "kick",
      data: user._id,
    });
  }

  /**
   * Transfers host to another User
   * @param {User} user - The target user to receive host
   * @returns {void}
   */
  public transferHost(user: User): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "transferownership",
      data: user._id,
    });
  }

  /**
   * Patches the Room Class
   * @param {any} gmupdateData - The data from the gmupdate event
   * @param {boolean} newRoom - Whether or not to emit the join event
   * @returns {Promise<void>}
   */
  public async patch(gmupdateData: any, newRoom?: boolean): Promise<void> {
    this.raw = gmupdateData;

    this.id = gmupdateData.id;
    this.type = gmupdateData.type;

    this.players = [];

    for (const player of gmupdateData.players) {
      this.players.push({
        bracket: player.bracket,
        user: (await this.client.users?.fetch(player._id)) as User,
      });
    }

    this.owner = (await this.client.users?.fetch(gmupdateData.owner)) as User;

    this.inGame = gmupdateData.game.state === "ingame";

    this.config = {
      meta: {
        name: gmupdateData.meta.name,
        userlimit: gmupdateData.meta.userlimit,
        allowAnonymous: gmupdateData.meta.allowAnonymous,
        bgm: gmupdateData.meta.bgm,
        match: {
          ft: gmupdateData.meta.match.ft,
          wb: gmupdateData.meta.match.wb,
        },
      },
      options: {
        stock: gmupdateData.game.options.stock,
        bagtype: gmupdateData.game.options.bagtype,
        spinbonuses: gmupdateData.game.options.spinbonuses,
        allow180: gmupdateData.game.options.allow180,
        kickset: gmupdateData.game.options.kickset,
        allow_harddrop: gmupdateData.game.options.allow_harddrop,
        display_next: gmupdateData.game.options.display_next,
        display_hold: gmupdateData.game.options.display_hold,
        nextcount: gmupdateData.game.options.nextcount,
        display_shadow: gmupdateData.game.options.display_shadow,
        are: gmupdateData.game.options.are,
        lineclear_are: gmupdateData.game.options.lineclear_are,
        room_handling: gmupdateData.game.options.room_handling,
        room_handling_arr: gmupdateData.game.options.room_handling_arr,
        room_handling_das: gmupdateData.game.options.room_handling_das,
        room_handling_sdf: gmupdateData.game.options.room_handling_sdf,
        g: gmupdateData.game.options.g,
        gincrease: gmupdateData.game.options.gincrease,
        gmargin: gmupdateData.game.options.gmargin,
        garbagemultiplier: gmupdateData.game.options.garbagemultiplier,
        garbagemargin: gmupdateData.game.options.garbagemargin,
        garbageincrease: gmupdateData.game.options.garbageincrease,
        locktime: gmupdateData.game.options.locktime,
        garbagespeed: gmupdateData.game.options.garbagespeed,
        garbagecap: gmupdateData.game.options.garbagecap,
        garbagecapincrease: gmupdateData.game.options.garbagecapincrease,
        garbagecapmax: gmupdateData.game.options.garbagecapmax,
        manual_allowed: gmupdateData.game.options.manual_allowed,
        b2bchaining: gmupdateData.game.options.b2bchaining,
        clutch: gmupdateData.game.options.clutch,
      },
    };

    if (newRoom) this.client.user?.emit("join");
  }
}

export default interface Room {
  /**
   * Emitted whenever a user talks in the Room
   */
  on(
    event: "message",
    callback: (message: {
      content: string;
      author?: User;
      system: boolean;
    }) => void
  ): this;

  /**
   * Emitted whenever a Room is about to start
   */
  on(
    event: "ready",
    callback: (data: {
      contexts: {
        user: User;
        handling: Handling;
        opts: { fulloffset: number; fullinterval: number };
      }[];
      firstGame: boolean;
    }) => void
  ): this;

  /**
   * Emitted whenever the room settings update
   */
  on(event: "settings_update", callback: () => void): this;

  /**
   * Emitted whenever the room starts
   */
  on(event: "start", callback: () => void): this;

  /**
   * Emitted whenever the room ends
   */
  on(event: "end", callback: () => void): this;

  /**
   * Emitted whenever a player switches brackets
   */
  on(
    event: "bracketSwap",
    callback: (player: { bracket: "playing" | "spectator"; user: User }) => void
  ): this;

  /**
   * Emitted whenever the ownership of the Room changes
   */
  on(event: "hostSwitch", callback: (newHost: User) => void): this;

  /**
   * Emitted whenever a user joins the Room
   */
  on(event: "join", callback: (user: User) => void): this;

  /**
   * Emitted whenever a user joins the Room
   */
  on(event: "leave", callback: (user: User) => void): this;
}
