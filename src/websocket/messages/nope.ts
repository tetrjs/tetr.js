import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.emit("err", { fatal: true, reason: packet.data.reason });

  ws.client.disconnect();
};
