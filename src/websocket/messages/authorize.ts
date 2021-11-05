import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  ws.client.emit("ready");

  ws.client.user?.setRelationships(packet.data.social.relationships);
  ws.client.user?.setPresence({ status: "online", detail: "" });
};
