import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.client.emit("migrate", { name: packet.data.name, flag: packet.data.flag });

  ws.migrate(packet.data.endpoint);
};
