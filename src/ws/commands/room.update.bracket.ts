import WebSocketManager from "../WebSocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { uid, bracket } }: any
) {
  let player = {
    user: await client.fetchUser(uid),
    bracket,
  };

  client.room.players?.set(uid, player);

  client.room.emit("bracket", player);
}
