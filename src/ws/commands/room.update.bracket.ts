import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { uid, bracket } }: any
) {
  let player = {
    user: await User.fetch(client, uid),
    bracket,
  };

  client.room.players?.set(uid, player);

  client.room.emit("bracket", player);
}
