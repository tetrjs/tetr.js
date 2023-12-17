import { GameOptions } from "../room/Room";
import User from "../user/User";

// switch to member
export default class Player {
  constructor(player: any, user: User, isNew: boolean) {
    this.user = user;

    this.isNew = isNew;
    this.player_ = player;

    // redo this sometime and change gameoption type to PlayerOption
    // not all the same
    this.options = {
      ...player.options,
      seedRandom: player.options.seed_random,
      countdownCount: player.options.countdown_count,
      countdownInterval: player.options.countdown_interval,
      missionType: player.options.mission_type,
      zoomInto: player.options.zoom_into,
      slotCounter1: player.options.slot_counter1,
      slotCounter2: player.options.slot_counter2,
      slotCounter3: player.options.slot_counter3,
      slotCounter4: player.options.slot_counter4,
      slotCounter5: player.options.slot_counter5,
      slotBar1: player.options.slot_bar1,
      displayFire: player.options.display_fire,
      displayUsername: player.options.display_username,
      hasGarbage: player.options.hasgarbage,
      bgmNoReset: player.options.bgmnoreset,
      neverStopBgm: player.options.neverstopbgm,
      displayNext: player.options.display_next,
      displayHold: player.options.display_hold,
      infiniteHold: player.options.infinite_hold,
      gMargin: player.options.gmargin,
      gIncrease: player.options.gincrease,
      garbageMultiplier: player.options.garbagemultiplier,
      garbageMargin: player.options.garbagemargin,
      garbageIncrease: player.options.garbageincrease,
      garbageCapMax: player.options.garbagecapmax,
      garbageAbsoluteCap: player.options.garbageabsolutecap,
      garbageHoleSize: player.options.garbageholesize,
      garbagePhase: player.options.garbagephase,
      garbageQueue: player.options.garbagequeue,
      garbageAre: player.options.garbageare,
      garbageEntry: player.options.garbageentry,
      garbageBlocking: player.options.garbageblocking,
      garbageTargetBonus: player.options.garbagetargetbonus,
      bagType: player.options.bagtype,
      spinBonuses: player.options.spinbonuses,
      comboTable: player.options.combotable,
      kickSet: player.options.kickset,
      nextCount: player.options.nextcount,
      allowHardDrop: player.options.allow_harddrop,
      displayShadow: player.options.display_shadow,
      lockTime: player.options.locktime,
      garbageSpeed: player.options.garbagespeed,
      forfeitTime: player.options.forfeit_time,
      lineClearAre: player.options.lineclear_are,
      infiniteMovement: player.options.infinitemovement,
      lockResets: player.options.lockresets,
      roomHandling: player.options.room_handling,
      roomHandlingArr: player.options.room_handling_arr,
      roomHandlingDas: player.options.room_handling_das,
      roomHandlignSdf: player.options.room_handling_sdf,
      manualAllowed: player.options.manual_allowed,
      b2bChaining: player.options.b2bchaining,
      allClears: player.options.allclears,
      noLockout: player.options.nolockout,
      canUndo: player.options.can_undo,
      canRetry: player.options.can_retry,
      retryIsClear: player.options.retryisclear,
      noExtraWidth: player.options.noextrawidth,
      boardWidth: player.options.boardwidth,
      boardHeight: player.options.boardheight,
      newPayback: player.options.new_payback,
    };

    this.board = new Board(this.options);
    this.id = player.gameid;
    this.player_ = player;

    this.t = this.options.seed % 2147483647;

    if (this.t <= 0) this.t += 2147483646;
  }

  private t = 2147483646;
  private lastGenerated?: number;
  private isNew: boolean;

  // raw init data
  public player_: any;

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
      this.options.prestart +
      (this.isNew ? this.options.precountdown : 0) +
      (this.options.countdown
        ? this.options.countdownInterval * this.options.countdownCount
        : 0)
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
