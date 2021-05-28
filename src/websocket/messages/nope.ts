import WebSocketManager from "../WebSocketManager";
import chalk from "chalk";

export = async function (packet: any, ws: WebSocketManager): Promise<void> {
  console.warn(`${chalk.yellow.bold("[WARNING]:")} ${packet.data.reason}`);
};
