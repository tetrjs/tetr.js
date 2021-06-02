import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  const gameLeaderboard: {
    user: User;
    wins: number;
    inputs: number;
    piecesPlaced: number;
  }[] = [];

  const leaderboard = packet.data.leaderboard;
  for (let i = 0; i < leaderboard.length; i++) {
    gameLeaderboard.push({
      user: (await ws.client.users?.fetch(leaderboard[i]._id)) as User,
      wins: leaderboard[i].wins,
      inputs: leaderboard[i].inputs,
      piecesPlaced: leaderboard[i].piecesplaced,
    });
  }

  ws.client.user?.room?.emit("end", gameLeaderboard);
};
