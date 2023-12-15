import WebSocketManager from "../WebSocketManager";

export default function ({ socket }: WebSocketManager, { data }: any) {
  socket?.emit("message", Buffer.from(data));
}
