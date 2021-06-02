import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.client.emit("err", { fatal: false, reason: packet.data });
};
