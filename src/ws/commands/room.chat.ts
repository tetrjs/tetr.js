import WebSocketManager from "../WebsocketManager";

export default async function (
  { client }: WebSocketManager,
  {
    data: {
      content,
      user: { _id },
    },
  }: any
) {
  client.room.emit("chat", {
    content,
    player: client.room.players?.get(_id),
  });
}
