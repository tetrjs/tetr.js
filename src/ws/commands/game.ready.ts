import Game from "../../game/Game";
import WebSocketManager from "../WebSocketManager";

export default function (
  { client }: WebSocketManager,
  { data: { players } }: any
) {
  if (client.me) client.room.game = new Game(client.me, players);

  client.room.emit("start", client.room.game);
}
