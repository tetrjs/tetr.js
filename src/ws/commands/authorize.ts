import WebSocketManager from "../WebSocketManager";

export default function ({ client: { me } }: WebSocketManager) {
  me?.presence({ status: "online", detail: "menus" });
}
