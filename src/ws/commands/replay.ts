import WebSocketManager from "../WebSocketManager";

export default async function (ws: WebSocketManager, { data }: any) {
  if (!ws.client.room?.game) return;

  ws.client.room.game.players.get(data.gameid)?.replayFrames.push(...data.frames);
}
