import WebSocketManager from "../WebSocketManager";
import chalk from "chalk";

export = function (packet: any, ws: WebSocketManager): void {
  console.error(`${chalk.yellow.bold("[WARNING]:")} ${packet.data.reason}`);

  ws.client.disconnect();

  ws.client.emit("kick", packet.data.reason);
};
