import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  if (!ws.socketId && !ws.resumeId) {
    ws.socketId = packet.id;
    ws.resumeId = packet.resume;

    if (ws.client.user)
      ws.client.user.handling = {
        arr: 0,
        das: 1,
        sdf: 41,
        safelock: false,
        cancel: false,
        dcd: 0,
      };

    ws.send_packet({
      id: ws.clientId,
      command: "authorize",
      data: {
        token: ws.client.token,
        handling: ws.client.user?.handling,
        signature: {
          commit: {
            id: ws.client.commitId,
          },
        },
      },
    });
  } else {
    packet.packets.forEach((messages: any) => ws.receive_packet(messages));
  }
};
