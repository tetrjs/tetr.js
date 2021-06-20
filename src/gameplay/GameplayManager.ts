import { Client, Context } from "..";
import EventEmitter from "events";
import { KeyEvent, StartEvent, Targets } from "./GameplayTypes";

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

    const options = readyData.options;
    console.log(options);

    client.user?.room?.once("start", () => {
      setTimeout(
        () => {
          this.started = new Date();

          this.start();
        },
        options.countdown
          ? options.countdown_count * options.countdown_interval
          : 0 + options.precountdown + options.prestart
      );
      console.log(
        options.countdown
          ? options.countdown_count * options.countdown_interval
          : 0 + options.precountdown + options.prestart
      );
    });
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

  /**
   * The time the game started
   * @type {boolean}
   */
  public started?: Date;

  /**
   * Replays that will be sent
   * @type {(KeyEvent | StartEvent | Targets)[]}
   */
  public nextFrames: (KeyEvent | StartEvent | Targets)[] = [];

  private frameTimer?: NodeJS.Timeout;

  // Functions

  public move(): void {}

  public start(): void {
    console.log("starting");
    if (!!this.started)
      this.client.ws?.send_packet({
        id: this.client.ws.clientId,
        command: "replay",
        data: {
          listenID: this.id,
          frames: [
            {
              frame: 0,
              type: "start",
              data: {},
            },
            {
              frame: 0,
              type: "targets",
              data: {
                id: "diyusi",
                frame: 0,
                type: "targets",
                data: [
                  this.contexts[
                    Math.floor(Math.random() * this.contexts.length)
                  ].user._id + this.id,
                ],
              },
            },
          ],
          provisioned:
            (new Date().getSeconds() - this.started.getSeconds()) * 60,
        },
      });
    if (!this.frameTimer)
      this.frameTimer = setInterval(() => {
        if (!!this.started) {
          this.client.ws?.send_packet({
            id: this.client.ws.clientId,
            command: "replay",
            data: {
              listenID: this.id,
              frames: this.nextFrames,
              provisioned:
                (new Date().getSeconds() - this.started.getSeconds()) * 60,
            },
          });
        }
      }, 500);
  }

  public stop(): void {
    if (this.frameTimer) clearInterval(this.frameTimer);
  }
}
