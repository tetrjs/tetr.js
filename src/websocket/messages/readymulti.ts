import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user.room?.emit(
    "ready",
    packet.data.contexts,
    packet.data.first,
    packet.data.gameID
  );
};
