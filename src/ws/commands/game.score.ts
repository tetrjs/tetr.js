import Player from "../../game/Player";
import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager, { data }: any) {
  if (!ws.client.room?.game) return;

  let leaderboard: { player: Player; success: boolean; wins: number }[] = [];
  let victor!: Player;

  (data.leaderboard as any[]).forEach((x) => {
    let player = [...(ws.client.room.game?.players as Map<string, Player>).values()].find(
      (k) => k.user.id === x.id
    ) as Player;
    if (x.success) victor = player;
    leaderboard.push({
      player,
      success: x.success,
      wins: x.wins,
    });
  });

  ws.client.room.game.emit("score", leaderboard, victor);
}
