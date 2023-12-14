import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  clearInterval(ws.heartbeat);
  ws.socket?.close();
  await ws.connect(true, message.data.endpoint);
}
