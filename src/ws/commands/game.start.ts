import WebSocketManager from "../WebSocketManager";

export default function ({
  client: {
    room: { game },
  },
}: WebSocketManager) {
  if (game?.me)
    setTimeout(() => {
      game?.me?.start();
    }, game.me.player.options.prestart + /*this.isNew*/ (true ? game.me.player.options.precountdown : 0) + (game.me.player.options.countdown ? game.me.player.options.countdown_interval * game.me.player.options.countdown_count : 0));
}
