import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  if (message.data.data.user === ws.client.me?.user.id) return;

  ws.client.me?.emit("dm", {
    content: message.data.data.content,
    author: await User.fetch(ws.client, message.data.data.user),
  });
}
