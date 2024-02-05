import User from "../user/User";

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

export default class Player {
  constructor(player: any, user: User) {
    this.id = player.gameid;
    this.user = user;
    this.options = player.options;
    this.board = new Array(player.options.boardheight + player.options.boardbuffer).fill(
      new Array(player.options.boardwidth).fill(null)
    );

    this.resetBag();
    this.replayFrames.push({
      frame: 0,
      type: "full",
      data: {
        ...full,
        options: this.options,
        stats: { ...full.stats, seed: this.options.seed },
        game: {
          ...full.game,
          bag: this.nextPieces,
          board: this.board,
          g: this.options.g,
          handling: this.options.handling,
        },
      },
    });
    this.resetBag();
  }

  public id: string;
  public user: User;
  public options: any;
  public board: any;
  public replayFrames: any[] = [];

  private bag = ["z", "l", "o", "s", "i", "j", "t"];
  private currentBag?: string[] = [];
  private lastGenerated?: number;
  private t = 0;
  private bagQueue: string[][] = [];

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

  public resetBag() {
    this.bag = ["z", "l", "o", "s", "i", "j", "t"];

    this.lastGenerated = undefined;

    this.t = this.options.seed % 2147483647;

    if (this.t <= 0) this.t += 2147483646;

    this.bagQueue = [];
  }

  private nextPiece(): void {
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
    switch (this.options.bagtype) {
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
        let s = this.shuffleArray(["z", "l", "o", "s", "i", "j", "t"]);
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
}
