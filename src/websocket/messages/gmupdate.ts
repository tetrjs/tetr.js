import Room from "../../room/Room";
import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  if (ws.client.user.room) {
    ws.client.user.room.patch(
      packet.data.game.options,
      packet.data.players,
      packet.data.owner,
      packet.data.id,
      packet.data.game.state
    );

    ws.client.user.room.emit("settings_update");
  } else {
    ws.client.user.room = new Room(
      packet.data.game.options,
      packet.data.players,
      packet.data.owner,
      packet.data.id,
      packet.data.game.state,
      ws.client
    );

    ws.client.emit("join");
  }
};
