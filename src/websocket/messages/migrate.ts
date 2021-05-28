import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.client.emit("migrate", packet.data);

  ws.migrate(packet.data.endpoint);
};
