import WebSocketManager from "../WebsocketManager";

export default function (ws: WebSocketManager, message: any) {
  ws.client.me?.emit("online", message.data);
}
