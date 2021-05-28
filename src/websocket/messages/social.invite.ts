import WebSocketManager from "../WebSocketManager";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  ws.client.emit("invite", {
    author: await ws.client.users?.fetch(packet.data.sender, true),
    room: { id: packet.data.roomid, name: packet.data.roomname },
  });
};
