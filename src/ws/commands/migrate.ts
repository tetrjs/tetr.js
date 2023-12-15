import WebSocketManager from "../WebsocketManager";

export default async function (
  ws: WebSocketManager,
  { data: { endpoint } }: any
) {
  clearInterval(ws.heartbeat);
  ws.socket?.close();
  await ws.connect(true, endpoint);
}
