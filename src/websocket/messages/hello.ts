import WebSocketManager from "../WebSocketManager";
import msgpack from "msgpack-lite";

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
    for (let i = 0; i < packet.packets.length; i++) {
      if (!["authorize", "migrate"].includes(packet.packets[i].command)) {
        const buf = Buffer.alloc(msgpack.encode(packet.packets[i]).length + 1);

        buf.set([0x45], 0);

        buf.set(msgpack.encode(packet.packets[i]), 1);

        ws.receive_packet(buf);
      }
    }
  }
};
