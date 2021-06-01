import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user?.room?.emit(
    "leave",
    await ws.client.users?.fetch(packet.data)
  );
};
