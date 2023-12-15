import WebSocketManager from "../WebSocketManager";

export default function (_: WebSocketManager, { data }: any) {
  console.warn(data);
}
