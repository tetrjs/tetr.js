import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  if (!packet.data.success) {
    ws.client.emit("err", {
      fatal: true,
      reason: "Invalid Token.",
    });

    return void ws.client.disconnect();
  }
  ws.client.emit("ready");

  ws.client.user?.setRelationships(packet.data.social.relationships, packet.data.social.presences);
  ws.client.user?.setPresence({ status: "online", detail: "" });
};
