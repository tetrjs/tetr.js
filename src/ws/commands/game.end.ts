import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager) {
  ws.client.room.game?.me?.end();

  ws.client.room.emit("end");
}
