import WebSocketManager from "../WebSocketManager";

export default function (_: WebSocketManager, { data }: any) {
  throw new Error(data);
}
