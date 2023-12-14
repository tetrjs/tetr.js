import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  ws.socket?.emit("message", Buffer.from(message.data));
}
