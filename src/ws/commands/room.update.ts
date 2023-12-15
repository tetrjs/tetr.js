import WebSocketManager from "../WebSocketManager";

export default async function ({ client }: WebSocketManager, { data }: any) {
  client.room.id = data.id;
  client.room.name = data.name;
  client.room.nameSafe = data.name_safe;
  client.room.type = data.type;
  client.room.owner = await client.fetchUser(data.owner);
  client.room.creator = await client.fetchUser(data.creator);
  client.room.topic = data.topic;
  client.room.options = {
    ...data.options,
    seedRandom: data.options.seed_random,
    countdownCount: data.options.countdown_count,
    countdownInterval: data.options.countdown_interval,
    missionType: data.options.mission_type,
    zoomInto: data.options.zoom_into,
    slotCounter1: data.options.slot_counter1,
    slotCounter2: data.options.slot_counter2,
    slotCounter3: data.options.slot_counter3,
    slotCounter4: data.options.slot_counter4,
    slotCounter5: data.options.slot_counter5,
    slotBar1: data.options.slot_bar1,
    displayFire: data.options.display_fire,
    displayUsername: data.options.display_username,
    hasGarbage: data.options.hasgarbage,
    bgmNoReset: data.options.bgmnoreset,
    neverStopBgm: data.options.neverstopbgm,
    displayNext: data.options.display_next,
    displayHold: data.options.display_hold,
    infiniteHold: data.options.infinite_hold,
    gMargin: data.options.gmargin,
    gIncrease: data.options.gincrease,
    garbageMultiplier: data.options.garbagemultiplier,
    garbageMargin: data.options.garbagemargin,
    garbageIncrease: data.options.garbageincrease,
    garbageCapMax: data.options.garbagecapmax,
    garbageAbsoluteCap: data.options.garbageabsolutecap,
    garbageHoleSize: data.options.garbageholesize,
    garbagePhase: data.options.garbagephase,
    garbageQueue: data.options.garbagequeue,
    garbageAre: data.options.garbageare,
    garbageEntry: data.options.garbageentry,
    garbageBlocking: data.options.garbageblocking,
    garbageTargetBonus: data.options.garbagetargetbonus,
    bagType: data.options.bagtype,
    spinBonuses: data.options.spinbonuses,
    comboTable: data.options.combotable,
    kickSet: data.options.kickset,
    nextCount: data.options.nextcount,
    allowHardDrop: data.options.allow_harddrop,
    displayShadow: data.options.display_shadow,
    lockTime: data.options.locktime,
    garbageSpeed: data.options.garbagespeed,
    forfeitTime: data.options.forfeit_time,
    lineClearAre: data.options.lineclear_are,
    infiniteMovement: data.options.infinitemovement,
    lockResets: data.options.lockresets,
    roomHandling: data.options.room_handling,
    roomHandlingArr: data.options.room_handling_arr,
    roomHandlingDas: data.options.room_handling_das,
    roomHandlignSdf: data.options.room_handling_sdf,
    manualAllowed: data.options.manual_allowed,
    b2bChaining: data.options.b2bchaining,
    allClears: data.options.allclears,
    noLockout: data.options.nolockout,
    canUndo: data.options.can_undo,
    canRetry: data.options.can_retry,
    retryIsClear: data.options.retryisclear,
    noExtraWidth: data.options.noextrawidth,
    boardWidth: data.options.boardwidth,
    boardHeight: data.options.boardheight,
    newPayback: data.options.new_payback,
  };
  client.room.userLimit = data.userLimit;
  client.room.autoStart = data.autoStart;
  client.room.allowAnonymous = data.allowAnonymous;
  client.room.allowUnranked = data.allowUnranked;
  client.room.allowBots = data.allowBots;
  (client.room.userRankLimit = data.userRankLimit),
    (client.room.useBestRankAsLimit = data.useBestRankAsLimit);
  client.room.forceRequireXPToChat = data.forceRequireXPToChat;
  client.room.bgm = data.bgm;
  client.room.match = {
    ...data.match,
    gameMode: data.match.gamemode,
    modeName: data.match.modename,
    recordReplays: data.match.record_replays,
  };
  client.room.players = new Map(
    await Promise.all(
      data.players.map(async ({ _id, bracket }: any) => {
        return [_id, { user: await client.fetchUser(_id), bracket }];
      })
    )
  );
}
