import Game from "../../game/Game";
import WebSocketManager from "../WebSocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { players } }: any
) {
  if (client.me)
    client.room.game = new Game(
      client.me,
      await Promise.all(
        players.map((player: any) => {
          return { ...player, user: client.fetchUser(player.userid) };
        })
      )
    );

  client.room.emit("start", client.room.game);
}
