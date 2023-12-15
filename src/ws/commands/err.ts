import WebSocketManager from "../WebsocketManager";

export default function (_: WebSocketManager, { data }: any) {
  console.warn(data);
}
