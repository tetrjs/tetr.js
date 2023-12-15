import WebSocketManager from "../WebsocketManager";

export default function ({ client: { me } }: WebSocketManager, message: any) {
  me?.emit("online", message.data);
}
