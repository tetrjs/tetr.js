import WebSocketManager from "../WebSocketManager";

export default function ({ client: { me } }: WebSocketManager, message: any) {
  me?.emit("online", message.data);
}
