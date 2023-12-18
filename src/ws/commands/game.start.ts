import WebSocketManager from "../WebSocketManager";

export default function ({
  client: {
    room: { game },
  },
}: WebSocketManager) {
  setTimeout(() => {
    game?.me?.start();
  }, game?.me?.player.pregameTime);
}
