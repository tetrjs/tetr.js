import EventEmitter from "events";
import { Client, Handling } from "..";
import User from "../user/User";

export default class Room extends EventEmitter {
  /**
   * The Room Class
   * @param {any[]} options - The Room options
   * @param {any[]} players - The Players in the Room
   * @param {string} owner - The owner of the Room
   * @param {string} id - The ID of the Room
   * @param {string} state - The current state of the Room
   * @param {Client} client - The Client Class
   * @constructor
   */
  constructor(
    options: any[],
    players: any[],
    owner: string,
    id: string,
    state: string,
    client: Client
  ) {
    super();

    this.client = client;

    this.patch(options, players, owner, id, state, true);
  }

  // Variables

  /**
   * The Client Class
   * @type {Client}
   * @readonly
   */
  private client!: Client;

  /**
   * The current Room options
   * @type {Object}
   * @readonly
   */
  public options!: Object;

  /**
   * The players currently in the Room
   * @type {object}
   * @readonly
   */
  public players!: {
    user: User;
    mode: "spectator" | "player";
    games: { played: number; wins: number; streak: number };
  }[];

  /**
   * The owner of the Room
   * @type {User}
   * @readonly
   */
  public owner!: User;

  /**
   * The current Room ID
   * @type {string}
   * @readonly
   */
  public id!: string;

  /**
   * Weather or not the Room is currently in-game
   * @type {boolean}
   * @readonly
   */
  public inGame!: boolean;

  // Functions

  /**
   * Patches the Room data
   * @param {any[] | undefined} options - The Room options
   * @param {any[] | undefined} players - The Players in the Room
   * @param {string | undefined} owner - The owner of the Room
   * @param {string | undefined} id - The ID of the Room
   * @param {string | undefined} state - The current state of the Room
   * @returns {Proimse<void>}
   */
  public async patch(
    options?: Object,
    players?: any[],
    owner?: string,
    id?: string,
    state?: string,
    newRoom?: boolean
  ): Promise<void> {
    if (options) this.options = options;

    if (players) {
      this.players = [];

      for (var i = 0; i < players.length; i++) {
        this.players.push({
          mode: players[i].bracket,
          user: (await this.client.users?.fetch(players[i]._id)) as User,
          games: {
            played: players[i].record.games,
            wins: players[i].record.wins,
            streak: players[i].record.streak,
          },
        });
      }
    }

    if (owner) this.owner = (await this.client.users?.fetch(owner)) as User;

    if (id) this.id = id;

    if (state) this.inGame = state === "ingame";

    if (newRoom) this.client.ws?.client.user?.emit("join");
  }

  /**
   * Sends a message to the room
   * @param {string} content - The content of the message
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

  public updateConfig(changes: { index: string; value: any }[]): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "updateconfig",
      data: changes,
    });
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
    callback: (
      contexts: {
        user: User;
        handling: Handling;
        opts: { fulloffset: number; fullinterval: number };
      }[],
      firstGame: boolean
    ) => void
  ): this;

  /**
   * Emitted whenever room starts
   */
  on(event: "start", callback: () => void): this;
}
