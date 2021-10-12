import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  let user = ws.client.user?.room?.players.find((k) => k.user._id === packet.data.uid);

  if (!user) await new Promise((resolve) => ws.client.user?.once("join", resolve));

  user = ws.client.user?.room?.players.find((k) => k.user._id === packet.data.uid);

  if (!user) return;

  user.bracket = packet.data.bracket;

  ws.client.user?.room?.emit("bracket_swap", user);
};
