import EventEmitter from "events";
import { Client } from "..";
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

    this.patch(options, players, owner, id, state);

    this.client = client;
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
   * @type {any[]}
   * @readonly
   */
  public options!: any[];

  /**
   * The players currently in the Room
   * @type {object}
   * @readonly
   */
  public players!: { user: User; mode: "spectator" | "player" }[];

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
   * Patches the User data
   * @param {any[]} options - The Room options
   * @param {any[]} players - The Players in the Room
   * @param {string} owner - The owner of the Room
   * @param {string} id - The ID of the Room
   * @param {string} state - The current state of the Room
   * @returns {Proimse<void>}
   */
  public async patch(
    options: any[],
    players: any[],
    owner: string,
    id: string,
    state: string
  ): Promise<void> {
    this.options = options;

    this.players = [];

    for (var i = 0; i < players.length; i++) {
      this.players.push({
        mode: players[i].bracket,
        user: (await this.client.users.fetch(players[i]._id, true)) as User,
      });
    }

    this.owner = (await this.client.users.fetch(owner)) as User;

    this.id = id;

    this.inGame = state === "ingame";
  }

  /**
   * Sends a message to the room
   * @param {string} content - The content of the message
   * @returns {void}
   */
  public send(content: string): void {
    this.client.ws.send_packet({
      id: this.client.ws.clientId,
      command: "chat",
      data: content,
    });
  }
}
