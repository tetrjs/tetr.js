import EventEmitter from "node:events";
import WebSocketManager from "../ws/WebsocketManager";
import User from "../user/User";

export default class Room extends EventEmitter {
  constructor(ws: WebSocketManager) {
    super();

    this.ws = ws;
  }

  private ws: WebSocketManager;

  public id?: string;
  public name?: string;
  public nameSafe?: string;
  public type?: "public" | "private";
  public owner?: User;
  public creator?: User;
  public state?: string;
  public topic?: any;
  public auto?: { enabled: boolean; status: string; time: number; maxTime: 30 };
  public options?: {
    version: number;
    seedRandom: boolean;
    seed: number;
    g: number;
    stock: number;
    countdown: boolean;
    countdownCount: number;
    countdownInterval: number;
    precountdown: number;
    prestart: number;
    mission: string;
    missionType: string;
    zoomInto: string;
    slotCounter1: string;
    slotCounter2: string;
    slotCounter3: string;
    slotCounter4: string;
    slotCounter5: string;
    slotBar1: string;
    displayFire: boolean;
    displayUsername: boolean;
    hasGarbage: boolean;
    bgmNoReset: boolean;
    neverStopBgm: boolean;
    displayNext: boolean;
    displayHold: boolean;
    infiniteHold: boolean;
    gMargin: number;
    gIncrease: number;
    garbageMultiplier: number;
    garbageMargin: number;
    garbageIncrease: number;
    garbageCap: number;
    garbageCapIncrease: number;
    garbageCapMax: number;
    garbageAbsoluteCap: boolean;
    garbageHoleSize: number;
    garbagePhase: number;
    garbageQueue: boolean;
    garbageAre: number;
    garbageEntry: string;
    garbageBlocking: string;
    garbageTargetBonus: string;
    presets: string;
    bagType: string;
    spinBonuses: string;
    comboTable: string;
    kickSet: string;
    nextCount: number;
    allowHardDrop: boolean;
    displayShadow: boolean;
    lockTime: number;
    garbageSpeed: number;
    forfeitTime: number;
    are: number;
    lineClearAre: boolean;
    infiniteMovement: boolean;
    lockResets: number;
    allow180: boolean;
    objective: any;
    roomHandling: boolean;
    roomHandlingArr: number;
    roomHandlingDas: number;
    roomHandlignSdf: number;
    manualAllowed: boolean;
    b2bChaining: boolean;
    allClears: boolean;
    clutch: boolean;
    noLockout: boolean;
    passthrough: string;
    canUndo: boolean;
    canRetry: boolean;
    retryIsClear: boolean;
    noExtraWidth: boolean;
    stride: boolean;
    boardWidth: number;
    boardHeight: number;
    newPayback: boolean;
  };
  public userLimit?: number;
  public autoStart?: number;
  public allowAnonymous?: boolean;
  public allowUnranked?: boolean;
  public allowBots?: boolean;
  public userRankLimit?: string;
  public useBestRankAsLimit?: boolean;
  public forceRequireXPToChat?: boolean;
  public bgm?: string;
  public match?: {
    gameMode: string;
    modeName: string;
    ft: number;
    wb: 1;
    recordReplays: boolean;
    winningKey: string;
    keys: any;
    extra: any;
  };
  public players?: any[];

  public async join(room: string): Promise<Room> {
    this.ws.send({ command: "room.join", data: room.slice(-4) });
    return await new Promise<Room>((resolve) => {
      this.ws.once("room.update", () => {
        return resolve(this);
      });
    });
  }

  public async leave(): Promise<void> {
    this.ws.send({ command: "room.leave" });
    await new Promise<void>((resolve) => {
      this.ws.once("room.leave", () => {
        this.id = undefined;
        this.name = undefined;
        this.nameSafe = undefined;
        this.type = undefined;
        this.owner = undefined;
        this.creator = undefined;
        this.state = undefined;
        this.topic = undefined;
        this.auto = undefined;
        this.options = undefined;
        this.userLimit = undefined;
        this.autoStart = undefined;
        this.allowAnonymous = undefined;
        this.allowUnranked = undefined;
        this.allowBots = undefined;
        this.userRankLimit = undefined;
        this.useBestRankAsLimit = undefined;
        this.forceRequireXPToChat = undefined;
        this.bgm = undefined;
        this.match = undefined;
        this.players = undefined;

        resolve();
      });
    });
  }

  public async create(data: "public" | "private" = "private"): Promise<Room> {
    this.ws.send({ command: "room.create", data });
    return await new Promise<Room>((resolve) => {
      this.ws.once("room.update", () => {
        return resolve(this);
      });
    });
  }
}
