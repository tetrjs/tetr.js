import WebSocketManager from "../WebSocketManager";
import fetch from "node-fetch";
import msgpack from "msgpack-lite";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  if (!ws.socketId && !ws.resumeId) {
    ws.socketId = packet.id;
    ws.resumeId = packet.resume;

    const file = await fetch("https://tetr.io/js/tetrio.js");
    const text = await file.text();
    const id = text.match(/"commit":{"id":"(.{7})"/);

    if (!id || !id[1]) throw "Unable to fetch commit ID.";

    ws.client.user.handling = {
      arr: 0,
      das: 6,
      sdf: 5,
      safelock: true,
      cancel: false,
      dcd: 0,
    };

    ws.send_packet({
      id: ws.clientId,
      command: "authorize",
      data: {
        token: ws.client.token,
        handling: ws.client.user.handling,
        signature: {
          commit: {
            id: id[1],
          },
        },
      },
    });
  } else {
    for (var i = 0; i < packet.packets.length; i++) {
      if (!["authorize", "migrate"].includes(packet.packets[i].command)) {
        var buf = Buffer.alloc(msgpack.encode(packet.packets[i]).length + 1);

        buf.set([0x45], 0);

        buf.set(msgpack.encode(packet.packets[i]), 1);

        ws.receive_packet(buf);
      }
    }
  }
};
