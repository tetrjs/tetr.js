import { Client, Context } from "..";
import EventEmitter from "events";
import { InGameEvent, KeyEvent, StartEvent, Targets } from "./GameplayTypes";

export default class GameplayManager extends EventEmitter {
  constructor(readyData: any, contexts: Context[], client: Client) {
    super();

    this.client = client;
    this.id = readyData.gameID;
    this.first = readyData.first;
    this.contexts = contexts;
    this.playing = !!contexts.find((context) => context.user._id == client.user?._id);

    const options = readyData.options;
    client.user?.room?.once("start", () => {
      setTimeout(() => {
        this.started = new Date();

        this.start();
      }, (options.countdown ? options.countdown_count * options.countdown_interval : 0) + options.precountdown + options.prestart);
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
   * @type {((KeyEvent | StartEvent | Targets | InGameEvent)[]}
   */
  public nextFrames: (KeyEvent | StartEvent | Targets | InGameEvent)[] = [];

  private frameTimer?: NodeJS.Timeout;

  private igeId = 0;

  // Functions

  public currentFrame() {
    if (!this.started) this.started = new Date();
    return ((new Date().getTime() - this.started.getTime()) / 1000) * 60;
  }

  public inGameEvent(data: any) {
    switch (data.data.type) {
      case "attack":
        // TODO
        this.nextFrames.push({
          frame: this.currentFrame(),
          type: "ige",
          data: {
            id: this.igeId++,
            frame: this.currentFrame(),
            type: "ige",
            data: data.data,
          },
        });
        break;

      default:
        break;
    }
  }

  public setTarget(stream: string) {
    this.nextFrames.push({
      frame: this.currentFrame(),
      type: "targets",
      data: {
        id: "diyusi",
        frame: this.currentFrame(),
        type: "targets",
        data: [
          stream
            ? stream
            : this.contexts[Math.floor(Math.random() * this.contexts.length)].user._id + this.id,
        ],
      },
    });
  }

  public start() {
    if (!!this.started && this.playing) {
      // Check for started and playing

      // Send required replay packets
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
                  this.contexts[Math.floor(Math.random() * this.contexts.length)].user._id +
                    this.id,
                ],
              },
            },
          ],
          provisioned: this.currentFrame(),
        },
      });

      // Start frameTimer
      if (!this.frameTimer)
        this.frameTimer = setInterval(() => {
          if (this.started) {
            const currentFrame = this.currentFrame();

            const sendFrames: (KeyEvent | StartEvent | Targets | InGameEvent)[] = [];
            for (const [i, frame] of this.nextFrames.entries()) {
              if (frame.frame < currentFrame) sendFrames.push(...this.nextFrames.splice(i, 1));
            }

            // console.log(sendFrames);
            this.client.ws?.send_packet({
              id: this.client.ws.clientId,
              command: "replay",
              data: {
                listenID: this.id,
                frames: sendFrames,
                provisioned: currentFrame,
              },
            });
          }
        }, 500);
    }
  }

  public stop(): void {
    if (this.frameTimer) clearInterval(this.frameTimer);
  }
}
