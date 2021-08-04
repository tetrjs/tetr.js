import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user?.emit("message", {
    content: packet.data.data.content,
    content_safe: packet.data.data.content_safe,
    author: packet.data.data.system
      ? undefined
      : await ws.client.users?.fetch(packet.data.data.user),
    systemMessage: packet.data.data.system,
    id: packet.data._id,
    ts: packet.data.ts,
  });
};
