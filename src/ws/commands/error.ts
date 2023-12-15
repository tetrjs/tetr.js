import WebSocketManager from "../WebsocketManager";

export default function (_: WebSocketManager, { data }: any) {
  throw new Error(data);
}
