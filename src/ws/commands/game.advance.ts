import Player from "../../game/Player";
import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager, { data }: any) {
  if (!ws.client.room?.game) return;

  ws.client.room.game.replayData.push({
    board: data.currentboard,
    replays: (data.currentboard as any[]).map((x) => {
      let player = [...(ws.client.room.game?.players as Map<string, Player>).values()].find(
        (k) => k.user.id === x.id
      ) as Player;
      return { frames: player.replayFrames.at(-1).frame, events: player.replayFrames };
    }),
  });
  ws.client.room.game.players.forEach((v, k) => {
    v.replayFrames = [];
    ws.client.room.game?.players.set(k, v);
  });
}
