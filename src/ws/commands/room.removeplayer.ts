import WebSocketManager from "../WebSocketManager";

export default async function ({ client }: WebSocketManager, { data }: any) {
  client.room.players?.delete(data);

  client.room.emit("leave", await client.fetchUser(data));
}
