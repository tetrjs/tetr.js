import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.players = packet.data;

  ws.client.emit("playerCount", packet.data);
};
