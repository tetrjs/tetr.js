import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.emit("message", {
    content: packet.data.data.content,
    author: packet.data.data.system
      ? undefined
      : await ws.client.users?.fetch(packet.data.data.user, true),
    systemMessage: packet.data.data.system,
    id: packet.data._id,
    ts: packet.data.ts,
  });
};
