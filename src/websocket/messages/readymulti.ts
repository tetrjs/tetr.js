import WebSocketManager from "../WebSocketManager";
import { Context, User } from "../..";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  if (ws.client.user?.room) ws.client.user.room.inGame = true;

  const contexts: Context[] = await Promise.all(
    (packet.data.contexts as Array<any>).map(async (context) => ({
      user: (await ws.client.users?.fetch(context.user._id)) as User,
      handling: context.handling,
      opts: context.opts,
    }))
  );

  ws.client.user?.room?.emit("ready", {
    contexts,
    firstGame: packet.data.first,
  });
};
