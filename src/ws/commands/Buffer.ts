import WebSocketManager from "../WebsocketManager";

export default function ({ socket }: WebSocketManager, { data }: any) {
  socket?.emit("message", Buffer.from(data));
}
