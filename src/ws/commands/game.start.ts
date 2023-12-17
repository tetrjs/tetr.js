import WebSocketManager from "../WebSocketManager";

export default function ({
  client: {
    room: { game },
  },
}: WebSocketManager) {
  if (game?.me)
    setTimeout(() => {
      if (!game.me) return;
      game.me.lastFrame = Date.now();
      game.me.replay();
      game.me.emit("start", game.me);
    }, game.me.player.pregameTime);
}
