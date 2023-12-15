import WebSocketManager from "../WebSocketManager";

export default async function ({ client }: WebSocketManager, { data }: any) {
  client.me?.emit("invite", {
    author: await client.fetchUser(data.sender),
    room: data.roomid,
  });
}
