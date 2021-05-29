import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user?.room?.emit("message", {
    content: packet.data.content,
    author: packet.data.system
      ? undefined
      : await ws.client.users?.fetch(packet.data.data.user._id),
    system: packet.data.system,
  });
};
