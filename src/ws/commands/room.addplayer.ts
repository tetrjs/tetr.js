import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { _id, bracket } }: any
) {
  let player = {
    user: await User.fetch(client, _id),
    bracket,
  };

  client.room.players?.set(_id, player);

  client.room.emit("join", player);
}
