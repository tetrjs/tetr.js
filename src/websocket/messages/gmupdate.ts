import Room from "../../room/Room";
import WebSocketManager from "../WebSocketManager";

export = function (packet: any, ws: WebSocketManager): void {
  if (ws.client.user) {
    if (ws.client.user.room) {
      ws.client.user.room.patch(packet.data);

      ws.client.user.room.emit("settings_update");
    } else {
      ws.client.user.room = new Room(packet.data, ws.client);
    }
  }
};
