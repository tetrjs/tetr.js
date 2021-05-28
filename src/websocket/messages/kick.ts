import WebSocketManager from "../WebSocketManager";
import chalk from "chalk";

export = function (packet: any, ws: WebSocketManager): void {
  console.error(`${chalk.red.bold("[FATAL]:")} ${packet.data.reason}`);

  ws.client.disconnect();

  process.exit();
};
