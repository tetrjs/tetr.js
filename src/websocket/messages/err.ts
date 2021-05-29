import WebSocketManager from "../WebSocketManager";
import chalk from "chalk";

export = function (packet: any, ws: WebSocketManager): void {
  console.error(`${chalk.red.bold("[FATAL]:")} ${packet.data}`);

  ws.client.disconnect();

  process.exit();
};
