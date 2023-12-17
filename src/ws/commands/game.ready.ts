import Game from "../../game/Game";
import Player from "../../game/Player";
import WebSocketManager from "../WebSocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { players } }: any
) {
  if (client.me)
    client.room.game = new Game(
      client.me,
      await Promise.all(
        players.map(async ({ gameid, userid, options }: any) => {
          return new Player(
            gameid,
            await client.fetchUser(userid),
            // seems like options that come from game events have extra fields
            // havnt implemented yet
            {
              ...options,
              seedRandom: options.seed_random,
              countdownCount: options.countdown_count,
              countdownInterval: options.countdown_interval,
              missionType: options.mission_type,
              zoomInto: options.zoom_into,
              slotCounter1: options.slot_counter1,
              slotCounter2: options.slot_counter2,
              slotCounter3: options.slot_counter3,
              slotCounter4: options.slot_counter4,
              slotCounter5: options.slot_counter5,
              slotBar1: options.slot_bar1,
              displayFire: options.display_fire,
              displayUsername: options.display_username,
              hasGarbage: options.hasgarbage,
              bgmNoReset: options.bgmnoreset,
              neverStopBgm: options.neverstopbgm,
              displayNext: options.display_next,
              displayHold: options.display_hold,
              infiniteHold: options.infinite_hold,
              gMargin: options.gmargin,
              gIncrease: options.gincrease,
              garbageMultiplier: options.garbagemultiplier,
              garbageMargin: options.garbagemargin,
              garbageIncrease: options.garbageincrease,
              garbageCapMax: options.garbagecapmax,
              garbageAbsoluteCap: options.garbageabsolutecap,
              garbageHoleSize: options.garbageholesize,
              garbagePhase: options.garbagephase,
              garbageQueue: options.garbagequeue,
              garbageAre: options.garbageare,
              garbageEntry: options.garbageentry,
              garbageBlocking: options.garbageblocking,
              garbageTargetBonus: options.garbagetargetbonus,
              bagType: options.bagtype,
              spinBonuses: options.spinbonuses,
              comboTable: options.combotable,
              kickSet: options.kickset,
              nextCount: options.nextcount,
              allowHardDrop: options.allow_harddrop,
              displayShadow: options.display_shadow,
              lockTime: options.locktime,
              garbageSpeed: options.garbagespeed,
              forfeitTime: options.forfeit_time,
              lineClearAre: options.lineclear_are,
              infiniteMovement: options.infinitemovement,
              lockResets: options.lockresets,
              roomHandling: options.room_handling,
              roomHandlingArr: options.room_handling_arr,
              roomHandlingDas: options.room_handling_das,
              roomHandlignSdf: options.room_handling_sdf,
              manualAllowed: options.manual_allowed,
              b2bChaining: options.b2bchaining,
              allClears: options.allclears,
              noLockout: options.nolockout,
              canUndo: options.can_undo,
              canRetry: options.can_retry,
              retryIsClear: options.retryisclear,
              noExtraWidth: options.noextrawidth,
              boardWidth: options.boardwidth,
              boardHeight: options.boardheight,
              newPayback: options.new_payback,
            }
          );
        })
      )
    );

  client.room.emit("start", client.room.game);
}
