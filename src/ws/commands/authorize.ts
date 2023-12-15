import WebSocketManager from "../WebsocketManager";

export default function ({ client: { me } }: WebSocketManager) {
  me?.presence({ status: "online", detail: "menus" });
}
