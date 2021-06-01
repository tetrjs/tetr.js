import WebSocketManager from "../WebSocketManager";
import { Handling } from "../..";
import User from "../../user/User";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  let contexts: {
    user: User;
    handling: Handling;
    opts: { fulloffset: number; fullinterval: number };
  }[] = [];

  for (let context of packet.data.contexts) {
    const user = await ws.client.users?.fetch(context.user._id);
    if (!!user) {
      contexts.push({ user, handling: context.handling, opts: context.opts });
    }
  }

  ws.client.user?.room?.emit("ready", {
    contexts,
    firstGame: packet.data.first,
  });
};
