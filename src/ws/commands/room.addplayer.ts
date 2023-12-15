import WebSocketManager from "../WebSocketManager";

export default async function (
  { client }: WebSocketManager,
  { data: { _id, bracket } }: any
) {
  let player = {
    user: await client.fetchUser(_id),
    bracket,
  };

  client.room.players?.set(_id, player);

  client.room.emit("join", player);
}
