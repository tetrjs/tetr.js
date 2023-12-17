import { GameOptions } from "../room/Room";
import User from "../user/User";

// switch to member
export default class Player {
  constructor(id: string, user: User, options: GameOptions) {
    this.user = user;
    this.options = options;
    this.board = new Board(options);
    this.id = id;

    this.t = this.options.seed % 2147483647;

    if (this.t <= 0) this.t += 2147483646;
  }

  private t = 2147483646;
  private lastGenerated?: number;

  // not the exact same as on room.update
  // pls compare and see what should be added to type
  public options: GameOptions;
  public user: User;
  public board: Board;
  public id: string;

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

  public get pregameTime() {
    return (
      1000 +
      this.options.precountdown +
      this.options.countdownInterval * this.options.countdownCount
    );
  }

  public get nextPieces(): string[] {
    switch (this.options.bagType) {
      case "7-bag":
        return this.shuffleArray(bag);
      case "14-bag":
        return this.shuffleArray(bag.concat(bag));
      case "classic":
        let index = Math.floor(this.nextFloat() * (bag.length + 1));

        if (index === this.lastGenerated || index >= bag.length) {
          index = Math.floor(this.nextFloat() * bag.length);
        }

        this.lastGenerated = index;
        return [bag[index]];
      case "pairs":
        let s = this.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"]);
        let pairs = [s[0], s[0], s[0], s[1], s[1], s[1]];
        this.shuffleArray(pairs);

        return pairs;
      case "total mayhem":
        return [bag[Math.floor(this.nextFloat() * bag.length)]];
      default:
        return bag;
    }
  }
}

const bag = ["Z", "L", "O", "S", "I", "J", "T"];

export class Board {
  constructor(options: GameOptions) {
    this.pieces = new Array(options.boardHeight).fill(
      new Array(options.boardWidth).fill(null)
    );
  }

  public pieces: (string | null)[][];
}
