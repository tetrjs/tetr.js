import api from "../../util/api";
import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager, message: any) {
  ws.socketId = message.id;
  ws.resumeToken = message.resume;

  if (message.packets.length > 0) {
    // not working for some reason
    // ws.send({ command: "hello", packets: ws.clientIdd }, false);

    let messages = message.packets.sort((a: any, b: any) => b.id - a.id);

    messages
      .slice(
        0,
        messages.findIndex((message: any) => message.id === ws.serverId)
      )
      .sort((a: any, b: any) => a.id - b.id)
      .forEach((message: any) => {
        ws.receive(message);
      });
  } else {
    ws.send({
      command: "authorize",
      data: {
        token: ws.client.token,
        handling: {
          arr: 0,
          das: 1,
          sdf: 41,
          safelock: false,
          cancel: false,
          dcd: 0,
        },
        signature: (
          await api("/server/environment", undefined, undefined, undefined, undefined, {
            expire: new Date().getTime() + 60000 * 5,
            key: "server_environment",
          })
        ).signature,
      },
    });
  }
}
