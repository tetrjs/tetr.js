import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.receive_packet(Buffer.from(packet.data));
};
