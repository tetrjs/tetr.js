import EventEmitter from "node:events";
import Player from "../game/Player";
import WebSocketManager from "../ws/WebSocketManager";

const full = {
  successful: false,
  // not needed for init
  gameoverreason: null,
  replay: {},
  source: {},
  stats: {
    lines: 0,
    level_lines: 0,
    level_lines_needed: 1,
    inputs: 0,
    holds: 0,
    time: {
      start: 0,
      zero: true,
      locked: false,
      prev: 0,
      frameoffset: 0,
    },
    score: 0,
    zenlevel: 1,
    zenprogress: 0,
    level: 1,
    combo: 0,
    currentcombopower: 0,
    topcombo: 0,
    btb: 0,
    topbtb: 0,
    currentbtbchainpower: 0,
    tspins: 0,
    piecesplaced: 0,
    clears: {
      singles: 0,
      doubles: 0,
      triples: 0,
      quads: 0,
      pentas: 0,
      realtspins: 0,
      minitspins: 0,
      minitspinsingles: 0,
      tspinsingles: 0,
      minitspindoubles: 0,
      tspindoubles: 0,
      tspintriples: 0,
      tspinquads: 0,
      tspinpentas: 0,
      allclear: 0,
    },
    garbage: {
      sent: 0,
      received: 0,
      attack: 0,
      cleared: 0,
    },
    kills: 0,
    finesse: {
      combo: 0,
      faults: 0,
      perfectpieces: 0,
    },
  },
  diyusi: 0,
  enemies: [],
  targets: [],
  // not needed for init
  fire: 0,
  game: {
    hold: {
      piece: null,
      locked: false,
    },
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
    playing: true,
  },
  killer: {
    gameid: null,
    name: null,
    type: "sizzle",
  },
  aggregatestats: {
    apm: 0,
    pps: 0,
    vsscore: 0,
  },
};

interface Tetrominos {
  [piece: string]: { width: number; orientation: (null | string)[][][] };
}

const tetromino: Tetrominos = {
  z: {
    width: 3,
    orientation: [
      [
        ["z", "z"],
        [null, "z", "z"],
      ],
      [
        [null, null, "z"],
        [null, "z", "z"],
        [null, "z"],
      ],
      [[], ["z", "z"], [null, "z", "z"]],
      [[null, "z"], ["z", "z"], ["z"]],
    ],
  },
  l: {
    width: 3,
    orientation: [
      [
        [null, null, "l"],
        ["l", "l", "l"],
      ],
      [
        [null, "l"],
        [null, "l"],
        [null, "l", "l"],
      ],
      [[], ["l", "l", "l"], ["l"]],
      [
        ["l", "l"],
        [null, "l"],
        [null, "l"],
      ],
    ],
  },
  o: {
    width: 3,
    orientation: [
      [
        [null, "o", "o"],
        [null, "o", "o"],
      ],
    ],
  },
  s: {
    width: 3,
    orientation: [
      [
        [null, "s", "s"],
        ["s", "s"],
      ],
      [
        [null, "s"],
        [null, "s", "s"],
        [null, null, "s"],
      ],
      [[], [null, "s", "s"], ["s", "s"]],
      [["s"], ["s", "s"], [null, "s"]],
    ],
  },
  i: {
    width: 4,
    orientation: [
      [[], ["i", "i", "i", "i"]],
      [
        [null, null, "i"],
        [null, null, "i"],
        [null, null, "i"],
        [null, null, "i"],
      ],
      [[], [], ["i", "i", "i", "i"]],
      [
        [null, "i"],
        [null, "i"],
        [null, "i"],
        [null, "i"],
      ],
    ],
  },
  j: {
    width: 3,
    orientation: [
      [["j"], ["j", "j", "j"]],
      [
        [null, "j", "j"],
        [null, "j"],
        [null, "j"],
      ],
      [[], ["j", "j", "j"], [null, null, "j"]],
      [
        [null, "j"],
        [null, "j"],
        ["j", "j"],
      ],
    ],
  },
  t: {
    width: 3,
    orientation: [
      [
        [null, "t"],
        ["t", "t", "t"],
      ],
      [
        [null, "t"],
        [null, "t", "t"],
        [null, "t"],
      ],
      [[], ["t", "t", "t"], [null, "t"]],
      [
        [null, "t"],
        ["t", "t"],
        [null, "t"],
      ],
    ],
  },
};

export default class ClientPlayer extends EventEmitter {
  constructor(ws: WebSocketManager, me: Player) {
    super();

    this.ws = ws;
    this.player = me;
    this.resetBag();
    this.frames = [
      {
        type: "full",
        data: {
          ...full,
          options: me.options,
          stats: { ...full.stats, seed: me.options.seed },
          game: {
            ...full.game,
            bag: this.nextPieces,
            board: me.board,
            g: me.options.g,
            handling: me.options.handling,
          },
        },
      },
      { type: "start", data: {} },
    ];
    this.resetBag();
  }

  private ws: WebSocketManager;
  private frames: { type: string; data: any }[];
  private replayTimeout?: NodeJS.Timeout;
  private t = 0;
  private lastGenerated?: number;
  private bag = Object.keys(tetromino);
  private firstFrame = Date.now();
  private frameInterval?: NodeJS.Timeout;
  public orientation = 0;
  // wrong after first bag
  public currentBag?: string[] = [];
  private bagQueue: string[][] = [];
  public holdPiece?: string;

  public player: Player;

  private replay() {
    clearTimeout(this.replayTimeout);
    this.ws.send({
      command: "replay",
      data: {
        frames: this.frames.splice(0).map((frame) => {
          return { ...frame, frame: this.frame };
        }),
        gameid: this.player.id,
        provisioned: this.frame,
      },
    });

    this.replayTimeout = setTimeout(() => this.replay(), 500);
  }

  public start() {
    this.emit("start", this);
    this.firstFrame = Date.now();
    this.replay();
    this.frameInterval = setInterval(() => {
      if (this.frames.length > 0) this.replay();
    }, 1000 / 60);
  }

  public end() {
    clearTimeout(this.replayTimeout);
    clearInterval(this.frameInterval);
  }

  public resetBag() {
    this.bag = Object.keys(tetromino);

    this.lastGenerated = undefined;

    this.t = this.player.options.seed % 2147483647;

    if (this.t <= 0) this.t += 2147483646;

    this.bagQueue = [];
  }

  private next(): number {
    return (this.t = (16807 * this.t) % 2147483647);
  }

  private nextFloat(): number {
    return (this.next() - 1) / 2147483646;
  }

  private shuffleArray(array: string[]): string[] {
    if (array.length == 0) {
      return array;
    }

    for (let i = array.length - 1; i != 0; i--) {
      const r = Math.floor(this.nextFloat() * (i + 1));
      [array[i], array[r]] = [array[r], array[i]];
    }

    return array;
  }

  public hardDrop() {
    this.nextPiece();
    this.frames.push(
      {
        type: "keydown",
        data: { key: "hardDrop", subframe: this.subframe },
      },
      {
        type: "keyup",
        data: { key: "hardDrop", subframe: this.subframe + 0.0000000000000001 },
      }
    );
  }

  public softDrop() {
    this.frames.push(
      {
        type: "keydown",
        data: { key: "softDrop", hoisted: true, subframe: this.subframe },
      },
      {
        type: "keyup",
        data: { key: "softDrop", subframe: this.subframe },
      }
    );
  }

  public moveLeft(hoisted = false) {
    this.frames.push(
      {
        type: "keydown",
        data: { key: "moveLeft", hoisted, subframe: this.subframe },
      },
      {
        type: "keyup",
        data: { key: "moveLeft", subframe: this.subframe + 0.0000000000000001 },
      }
    );
  }

  public moveRight(hoisted = false) {
    this.frames.push(
      {
        type: "keydown",
        data: { key: "moveRight", hoisted, subframe: this.subframe },
      },
      {
        type: "keyup",
        data: {
          key: "moveRight",
          subframe: this.subframe + 0.0000000000000001,
        },
      }
    );
  }

  public rotateCW() {
    this.orientation =
      (this.orientation + 1) %
      (this.currentPiece ? tetromino[this.currentPiece].orientation.length : 4);
    this.frames.push(
      {
        type: "keydown",
        data: { key: "rotateCW", subframe: this.subframe },
      },
      {
        type: "keyup",
        data: { key: "rotateCW", subframe: this.subframe + 0.0000000000000001 },
      }
    );
  }

  public rotateCCW() {
    this.orientation =
      (this.orientation - 1) %
      (this.currentPiece ? tetromino[this.currentPiece].orientation.length : 4);
    this.frames.push(
      {
        type: "keydown",
        data: { key: "rotateCCW", subframe: this.subframe },
      },
      {
        type: "keyup",
        data: {
          key: "rotateCCW",
          subframe: this.subframe + 0.0000000000000001,
        },
      }
    );
  }

  public rotate180() {
    this.orientation =
      (this.orientation + 2) %
      (this.currentPiece ? tetromino[this.currentPiece].orientation.length : 4);
    this.frames.push(
      {
        type: "keydown",
        data: { key: "rotate180", subframe: this.subframe },
      },
      {
        type: "keyup",
        data: {
          key: "rotate180",
          subframe: this.subframe + 0.0000000000000001,
        },
      }
    );
  }

  public hold() {
    if (!this.currentBag) return;
    let currentPiece = this.currentBag[0];
    if (!this.holdPiece) {
      this.nextPiece();
    } else {
      this.currentBag?.shift();
      this.currentBag?.unshift(this.holdPiece);
    }
    this.holdPiece = currentPiece;
    this.frames.push(
      {
        type: "keydown",
        data: { key: "hold", subframe: this.subframe },
      },
      {
        type: "keyup",
        data: {
          key: "hold",
          subframe: this.subframe + 0.0000000000000001,
        },
      }
    );
  }

  private nextPiece(): void {
    this.orientation = 0;
    this.currentBag?.shift();
    if (!this.currentBag || this.currentBag.length <= 0) {
      if (this.bagQueue.length <= 0) {
        this.nextPieces;
      }
      this.currentBag = this.bagQueue.shift();
    }
  }

  public get currentPiece(): string | undefined {
    if (!this.currentBag || this.currentBag.length <= 0) this.nextPiece();
    if (this.currentBag) return this.currentBag[0];
  }

  public get nextPieces(): string[] {
    let bag: string[];
    switch (this.player.options.bagtype) {
      case "7-bag":
        bag = this.shuffleArray(this.bag);
        break;
      case "14-bag":
        bag = this.shuffleArray(this.bag.concat(this.bag));
        break;
      case "classic":
        let index = Math.floor(this.nextFloat() * (this.bag.length + 1));

        if (index === this.lastGenerated || index >= this.bag.length) {
          index = Math.floor(this.nextFloat() * this.bag.length);
        }

        this.lastGenerated = index;
        bag = [this.bag[index]];
        break;
      case "pairs":
        let s = this.shuffleArray(Object.keys(tetromino));
        let pairs = [s[0], s[0], s[0], s[1], s[1], s[1]];
        this.shuffleArray(pairs);

        bag = pairs;
        break;
      case "total mayhem":
        bag = [this.bag[Math.floor(this.nextFloat() * this.bag.length)]];
        break;
      default:
        bag = this.bag;
        break;
    }
    this.bagQueue.push(bag.slice());
    return bag;
  }

  public get subframe(): number {
    return (((Date.now() - this.firstFrame) / 1000) * 60) % 1;
  }

  public get frame(): number {
    return Math.floor(((Date.now() - this.firstFrame) / 1000) * 60);
  }
}

export default interface ClientPlayer extends EventEmitter {
  on(eventName: "start", listener: (me: ClientPlayer) => void): this;
}
