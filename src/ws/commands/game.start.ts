import WebSocketManager from "../WebSocketManager";

export default function ({ client: { room } }: WebSocketManager) {
  if (!room.game?.me) return;

  setTimeout(() => {
    if (!room.game?.me) return;

    console.log(room.game);

    room.game.emit("start", room.game.me);
  }, room.game.me.player.pregameTime);
}
