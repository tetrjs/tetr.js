import Game from "../../game/Game";
import Player from "../../game/Player";
import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager, { data }: any) {
  if (ws.client.me)
    ws.client.room.game = new Game(
      ws,
      ws.client.me,
      await Promise.all(
        data.players.map(async (player: any) => {
          return new Player(
            player,
            await ws.client.fetchUser(player.userid),
            data.isNew
          );
        })
      )
    );

  ws.client.room.emit("start", ws.client.room.game);
}
