import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  ws.client.room.id = message.data.id;
  ws.client.room.name = message.data.name;
  ws.client.room.nameSafe = message.data.name_safe;
  ws.client.room.type = message.data.type;
  ws.client.room.owner = await User.fetch(ws.client, message.data.owner);
  ws.client.room.creator = await User.fetch(ws.client, message.data.creator);
  ws.client.room.topic = message.data.topic;
  ws.client.room.options = {
    ...message.data.options,
    seedRandom: message.data.options.seed_random,
    countdownCount: message.data.options.countdown_count,
    countdownInterval: message.data.options.countdown_interval,
    missionType: message.data.options.mission_type,
    zoomInto: message.data.options.zoom_into,
    slotCounter1: message.data.options.slot_counter1,
    slotCounter2: message.data.options.slot_counter2,
    slotCounter3: message.data.options.slot_counter3,
    slotCounter4: message.data.options.slot_counter4,
    slotCounter5: message.data.options.slot_counter5,
    slotBar1: message.data.options.slot_bar1,
    displayFire: message.data.options.display_fire,
    displayUsername: message.data.options.display_username,
    hasGarbage: message.data.options.hasgarbage,
    bgmNoReset: message.data.options.bgmnoreset,
    neverStopBgm: message.data.options.neverstopbgm,
    displayNext: message.data.options.display_next,
    displayHold: message.data.options.display_hold,
    infiniteHold: message.data.options.infinite_hold,
    gMargin: message.data.options.gmargin,
    gIncrease: message.data.options.gincrease,
    garbageMultiplier: message.data.options.garbagemultiplier,
    garbageMargin: message.data.options.garbagemargin,
    garbageIncrease: message.data.options.garbageincrease,
    garbageCapMax: message.data.options.garbagecapmax,
    garbageAbsoluteCap: message.data.options.garbageabsolutecap,
    garbageHoleSize: message.data.options.garbageholesize,
    garbagePhase: message.data.options.garbagephase,
    garbageQueue: message.data.options.garbagequeue,
    garbageAre: message.data.options.garbageare,
    garbageEntry: message.data.options.garbageentry,
    garbageBlocking: message.data.options.garbageblocking,
    garbageTargetBonus: message.data.options.garbagetargetbonus,
    bagType: message.data.options.bagtype,
    spinBonuses: message.data.options.spinbonuses,
    comboTable: message.data.options.combotable,
    kickSet: message.data.options.kickset,
    nextCount: message.data.options.nextcount,
    allowHardDrop: message.data.options.allow_harddrop,
    displayShadow: message.data.options.display_shadow,
    lockTime: message.data.options.locktime,
    garbageSpeed: message.data.options.garbagespeed,
    forfeitTime: message.data.options.forfeit_time,
    lineClearAre: message.data.options.lineclear_are,
    infiniteMovement: message.data.options.infinitemovement,
    lockResets: message.data.options.lockresets,
    roomHandling: message.data.options.room_handling,
    roomHandlingArr: message.data.options.room_handling_arr,
    roomHandlingDas: message.data.options.room_handling_das,
    roomHandlignSdf: message.data.options.room_handling_sdf,
    manualAllowed: message.data.options.manual_allowed,
    b2bChaining: message.data.options.b2bchaining,
    allClears: message.data.options.allclears,
    noLockout: message.data.options.nolockout,
    canUndo: message.data.options.can_undo,
    canRetry: message.data.options.can_retry,
    retryIsClear: message.data.options.retryisclear,
    noExtraWidth: message.data.options.noextrawidth,
    boardWidth: message.data.options.boardwidth,
    boardHeight: message.data.options.boardheight,
    newPayback: message.data.options.new_payback,
  };
  ws.client.room.userLimit = message.data.userLimit;
  ws.client.room.autoStart = message.data.autoStart;
  ws.client.room.allowAnonymous = message.data.allowAnonymous;
  ws.client.room.allowUnranked = message.data.allowUnranked;
  ws.client.room.allowBots = message.data.allowBots;
  (ws.client.room.userRankLimit = message.data.userRankLimit),
    (ws.client.room.useBestRankAsLimit = message.data.useBestRankAsLimit);
  ws.client.room.forceRequireXPToChat = message.data.forceRequireXPToChat;
  ws.client.room.bgm = message.data.bgm;
  ws.client.room.match = {
    ...message.data.match,
    gameMode: message.data.match.gamemode,
    modeName: message.data.match.modename,
    recordReplays: message.data.match.record_replays,
  };
}
