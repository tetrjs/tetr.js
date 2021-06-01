import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.user?.room?.emit("join", await ws.client.users?.fetch(packet.data));

  ws.client.user?.room?.players.splice(
    ws.client.user.room.players.indexOf(
      ws.client.user.room.players.find((k) => k.user._id === packet.data) as {
        bracket: "playing" | "spectator";
        user: User;
      }
    ),
    1
  );
};
