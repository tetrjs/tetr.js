import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.client.emit("err", { fatal: true, reason: packet.data.reason });

  ws.client.disconnect();
};
