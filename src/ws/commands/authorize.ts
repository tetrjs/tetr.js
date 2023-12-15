import WebSocketManager from "../WebsocketManager";

export default function (ws: WebSocketManager) {
  ws.client.me?.presence({ status: "online", detail: "menus" });
}
