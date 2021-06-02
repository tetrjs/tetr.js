import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  const joinedUser = await ws.client.users?.fetch(packet.data._id);

  ws.client.user?.room?.players.push({
    bracket: packet.data.bracket,
    user: joinedUser as User,
  });

  ws.client.user?.room?.emit("join", joinedUser);
};
