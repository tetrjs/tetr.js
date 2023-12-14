import api from "../../util/api";
import WebSocketManager from "../WebsocketManager";

export default async function (ws: WebSocketManager, message: any) {
  ws.socketId = message.id;
  ws.resumeToken = message.resume;

  ws.send({
    command: "authorize",
    data: {
      token: ws.client.token,
      handling: {
        arr: 0,
        das: 1,
        sdf: 5,
        safelock: false,
        cancel: false,
        dcd: 0,
      },
      signature: (await api("/server/environment")).signature,
    },
  });
}
