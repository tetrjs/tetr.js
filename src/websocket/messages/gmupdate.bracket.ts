import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  if (ws.client.user?.room?.players)
    ws.client.user.room.players[
      ws.client.user.room.players.indexOf(
        ws.client.user.room.players.find(
          (k) => k.user._id === packet.data.uid
        ) as {
          bracket: "playing" | "spectator";
          user: User;
        }
      ) as number
    ].bracket = packet.data.bracket;

  ws.client.user?.room?.emit(
    "bracket_swap",
    ws.client.user.room.players.find((k) => k.user._id === packet.data.uid)
  );
};
