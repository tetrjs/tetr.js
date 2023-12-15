import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  ws.client.me?.emit("invite", {
    author: await User.fetch(ws.client, message.data.sender),
    room: message.data.roomid,
  });
}
