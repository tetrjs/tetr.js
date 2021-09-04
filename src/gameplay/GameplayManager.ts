import { Client, Context, User } from "..";
import EventEmitter from "events";
import { InGameEvent, Key, KeyEvent, StartEvent, Targets } from "./GameplayTypes";
import PiecesGen from "./piecesGen";

export default class GameplayManager extends EventEmitter {
  constructor(readyData: any, contexts: Context[], client: Client) {
    super();

    this.client = client;
    this.id = readyData.gameID;
    this.first = readyData.first;
    this.contexts = contexts;
    this.playing = !!contexts.find((context) => context.user._id == client.user?._id);

    this.options = readyData.options;

    client.user?.room?.once("start", () => {
      setTimeout(() => {
        this.started = new Date();

        this.start();
      }, (this.options.countdown ? this.options.countdown_count * this.options.countdown_interval : 0) + (this.first ? this.options.precountdown : 0) + this.options.prestart);
    });
  }

  // Variables

  private options;

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

  public currentFrame(): number;
  public currentFrame(returnSubframe: true): { frame: number; subframe: number };
  public currentFrame(returnSubframe?: true) {
    if (!this.started) this.started = new Date();
    if (returnSubframe) {
      const amountTime = ((new Date().getTime() - this.started.getTime()) / 1000) * 60;
      return { frame: Math.floor(amountTime), subframe: +(amountTime % 1).toFixed(1) };
    } else {
      return Math.round(((new Date().getTime() - this.started.getTime()) / 1000) * 60);
    }
  }

  public async inGameEvent(data: any) {
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
        this.emit("attack", {
          lines: data.data.lines,
          column: data.data.column,
          sender: await this.client.users.fetch(data.data.sender),
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
    this.emit("start");
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
              type: "full",
              data: {
                successful: false,
                gameoverreason: null,
                replay: {},
                source: {},
                options: {
                  ...this.options,
                  ...this.contexts.find((context) => context.user._id == this.client.user?._id)
                    ?.opts,
                  username: this.client.user?.username,
                  physical: true,
                },
                stats: {
                  seed: this.options.seed,
                  lines: 0,
                  level_lines: 0,
                  level_lines_needed: 1,
                  inputs: 0,
                  time: { start: 0, zero: true, locked: false, prev: 0, frameoffset: 0 },
                  score: 0,
                  zenlevel: 1,
                  zenprogress: 0,
                  level: 1,
                  combo: 0,
                  currentcombopower: 0,
                  topcombo: 0,
                  btb: 0,
                  topbtb: 0,
                  tspins: 0,
                  piecesplaced: 0,
                  clears: {
                    singles: 0,
                    doubles: 0,
                    triples: 0,
                    quads: 0,
                    realtspins: 0,
                    minitspins: 0,
                    minitspinsingles: 0,
                    tspinsingles: 0,
                    minitspindoubles: 0,
                    tspindoubles: 0,
                    tspintriples: 0,
                    tspinquads: 0,
                    allclear: 0,
                  },
                  garbage: { sent: 0, received: 0, attack: 0, cleared: 0 },
                  kills: 0,
                  finesse: { combo: 0, faults: 0, perfectpieces: 0 },
                },
                targets: [],
                fire: 0,
                game: {
                  board: Array(40).fill(Array(10).fill(null)),
                  bag: new PiecesGen(this.options.seed).nextBag(),
                  hold: { piece: null, locked: false },
                  g: this.options.g,
                  controlling: {
                    ldas: 0,
                    ldasiter: 0,
                    lshift: false,
                    rdas: 0,
                    rdasiter: 0,
                    rshift: false,
                    lastshift: 0,
                    softdrop: false,
                  },
                  handling: this.client.user?.handling,
                  playing: true,
                },
                killer: { name: null, type: "sizzle" },
                assumptions: {},
                aggregatestats: { apm: 0, pps: 0, vsscore: 0 },
              },
            },
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
            // console.log(this.nextFrames);
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

  /** Move a piece */
  public move(key: Key, frames = 1, subframes = 0): void {
    const currentFrame = this.currentFrame(true);
    this.nextFrames.push({
      frame: currentFrame.frame,
      type: "keydown",
      data: { key, subframe: currentFrame.subframe },
    });
    this.nextFrames.push({
      frame: currentFrame.frame + frames,
      type: "keyup",
      data: { key, subframe: currentFrame.subframe + subframes },
    });
  }
}
export default interface GameplayManager {
  /**
   * Emitted whenever an attack is sent to the bot
   */
  on(
    event: "attack",
    callback: (data: { lines: number; column: number; sender?: User }) => void
  ): this;
  /**
   * Emitted when the start function is done, which should be after all the countdowns are done
   */
  on(event: "start", callback: () => void): this;
}
