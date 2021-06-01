import EventEmitter from "events";
import { Client, Config } from "..";
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
