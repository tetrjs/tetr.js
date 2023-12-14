import api from "../util/api";
import Client from "../client/Client";
import WebSocket from "ws";
import { Packr, Unpackr } from "msgpackr";
import { readdirSync } from "fs";
import { join } from "path";

const ribbonPackr = new Packr({
  bundleStrings: true,
  sequential: false,
});
const ribbonUnpackr = new Unpackr({
  bundleStrings: true,
  sequential: false,
});

export default class WebSocketManager {
  static readonly MESSAGE_TYPE = {
    STANDARD: 0x45,
    EXTRACTED_ID: 0xae,
    BATCH: 0x58,
    EXTENSION: 0xb0,
  };
  static readonly EXTENSION = { PING: 0x0b, PONG: 0x0c };

  constructor(client: Client) {
    this.client = client;
  }

  private commands: Map<
    string,
    (ws: WebSocketManager, message: any) => Promise<void> | void
  > = new Map(
    readdirSync(join(__dirname, "commands")).map((file: string) => [
      file.slice(0, -3),
      require(join(__dirname, "commands", file)).default,
    ])
  );

  public heartbeat?: NodeJS.Timeout;
  public socket?: WebSocket;
  public client: Client;
  public socketId?: string;
  public resumeToken?: string;
  public messageId = 0;

  public async connect(resume = false, endpoint?: string) {
    if (!endpoint)
      ({ endpoint } = await api("/server/ribbon", this.client.token));

    this.socket = new WebSocket(`wss://tetr.io${endpoint}`);

    this.socket.on("error", (err: string) => {
      throw new Error(err);
    });

    this.socket.on("open", () => {
      if (resume) {
        this.send(
          {
            command: "resume",
            socketid: this.socketId,
            resumetoken: this.resumeToken,
          },
          false
        );
      } else {
        this.send({ command: "new" }, false);
      }

      this.heartbeat = setInterval(() => {
        this.socket?.send(
          Buffer.from([
            WebSocketManager.MESSAGE_TYPE.EXTENSION,
            WebSocketManager.EXTENSION.PING,
          ])
        );
      }, 5000);
    });

    this.socket.on("message", (data: Buffer) => {
      switch (Number(data.readUint8(0))) {
        case WebSocketManager.MESSAGE_TYPE.STANDARD:
          this.receive(data.subarray(1));
          break;
        case WebSocketManager.MESSAGE_TYPE.EXTRACTED_ID:
          this.receive(data.subarray(5), data.readUint32BE(1));
          break;
        case WebSocketManager.MESSAGE_TYPE.BATCH:
          let lengths: number[] = [];
          let length = 0;
          while ((length = data.readUint32BE(lengths.length * 4 + 1)) !== 0) {
            lengths.push(length);
          }
          lengths.forEach((length, i) => {
            let offset = lengths
              .slice(0, i)
              .reduce((a, b) => a + b, 5 + lengths.length * 4);
            this.receive(data.subarray(offset, offset + length));
          });
          break;
        case WebSocketManager.MESSAGE_TYPE.EXTENSION:
          // ping/pong
          break;
      }
    });
  }

  public send(
    message: any,
    id = true,
    type = WebSocketManager.MESSAGE_TYPE.STANDARD
  ) {
    if (id) message.id = ++this.messageId;

    console.log("outgoing");
    console.log(message);

    this.socket?.send(
      Buffer.concat([Buffer.from([type]), ribbonPackr.pack(message)])
    );
  }

  public receive(packet: Buffer, id?: number) {
    let message = ribbonUnpackr.unpack(packet);

    if (id) message.id = id;

    console.log("incoming");
    console.log(message);

    let command = this.commands.get(message.command);

    if (command) command(this, message);
  }
}
