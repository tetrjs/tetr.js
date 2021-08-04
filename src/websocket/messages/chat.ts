import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user?.room?.emit("message", {
    content: packet.data.content,
    content_safe: packet.data.content_safe,
    author: packet.data.system ? undefined : await ws.client.users?.fetch(packet.data.user._id),
    system: packet.data.system,
  });
};
