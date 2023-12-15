import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function ({ client }: WebSocketManager, { data }: any) {
  client.room.players?.delete(data);

  client.room.emit("leave", await User.fetch(client, data));
}
