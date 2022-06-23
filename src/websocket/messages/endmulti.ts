import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  if (ws.client.user?.room) ws.client.user.room.inGame = false;

  const gameLeaderboard: {
    user: User;
    wins: number;
    inputs: number;
    piecesPlaced: number;
  }[] = await Promise.all(
    (packet.data.leaderboard as Array<any>).map(async (user) => ({
      user: (await ws.client.users?.fetch(user.user._id)) as User,
      wins: user.wins,
      inputs: user.inputs,
      piecesPlaced: user.piecesplaced,
    }))
  );

  ws.client.user?.room?.emit("end", gameLeaderboard);
};
