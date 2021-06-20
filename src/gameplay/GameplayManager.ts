import { Client, Context } from "..";
import EventEmitter from "events";

export default class GameplayManager extends EventEmitter {
  constructor(readyData: any, contexts: Context[], client: Client) {
    super();

    this.client = client;
    this.id = readyData.gameID;
    this.first = readyData.first;
    this.contexts = contexts;
    this.playing = !!contexts.find(
      (context) => context.user._id == client.user?._id
    );
  }

  // Variables

  /**
   * The Client Class
   * @type {Client}
   */
  private client: Client;

  /**
   * The id of the game
   * @type {string}
   */
  public id: string;

  /**
   * If the game is the first in the set or not
   * @type {boolean}
   */
  public first: boolean;

  /**
   * The contexts of the game
   * @type {Context[]}
   */
  public contexts: Context[];

  /**
   * Whether or not the bot is playing
   * @type {boolean}
   */
  public playing: boolean;
}
