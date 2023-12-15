import User from "../../user/User";
import WebSocketManager from "../WebsocketManager";

export default async function (
  { client }: WebSocketManager,
  {
    data: {
      data: { content, user },
    },
  }: any
) {
  if (user === client.me?.user.id) return;

  client.me?.emit("dm", {
    content,
    author: await User.fetch(client, user),
  });
}
