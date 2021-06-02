import { User } from "../..";
import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  const newHost = await ws.client.users?.fetch(packet.data);

  if (ws.client.user?.room) ws.client.user.room.owner = newHost as User;

  ws.client.user?.room?.emit("host_transfer", newHost);
};
