import WebSocket from "ws";
import Client from "../client/Client";
import msgpack from "msgpack-lite";
import fs from "fs";

export default class WebSocketManager {
  /**
   * The WebSocketManager Class
   * @param {string} endpoint - The endpoint of the server to connect to
   * @param {Client} client - The Client Class
   */
  constructor(endpoint: string, client: Client) {
    this.socket = new WebSocket(endpoint);

    this.client = client;

    this.socket.onopen = () => {
      this.send_packet({ command: "new" });

      this.heartbeat(5000);
    };

    this.socket.onmessage = (e) => {
      this.receive_packet(e.data as Buffer);
    };

    this.socket.onclose = () => {
      if (this.heartbeatTO) clearTimeout(this.heartbeatTO);
    };
  }

  // letiables

  /**
   * WebSocket messages
   * @type {Map<string, Function>}
   */
  private messages: Map<string, (packet: any, ws: WebSocketManager) => Promise<void> | void> =
    new Map(
      fs
        .readdirSync(`${__dirname}/messages`)
        .filter((k) => k.endsWith(".js"))
        .map((k: string) => [k.slice(0, -3), require(`${__dirname}/messages/${k}`)])
    );

  /**
   * The Client
   * @type {Client}
   */
  public client!: Client;

  /**
   * The socket connection to the server
   * @type {WebSocket}
   * @readonly
   */
  public socket!: WebSocket;

  /**
   * The current ServerId
   * @type {number}
   */
  public serverId = 0;

  /**
   * The WebSocket's id
   * @type {string}
   */
  public socketId!: string;

  /**
   * Packets awaiting to be sent to the server
   * @type {Buffer[]}
   */
  public queue: Buffer[] = [];

  /**
   * Packet history on the case of a migration
   * @type {Buffer[]}
   */
  public history: Buffer[] = [];

  /**
   * The ResumeId used for migration
   * @type {string}
   */
  public resumeId!: string;

  /**
   * The current ClientId
   * @type {number}
   */
  public clientId = 1;

  /**
   * The Timeout for the Ribbon's heartbeat
   * @type {NodeJS.Timeout}
   */
  private heartbeatTO?: NodeJS.Timeout;

  // Functions

  /**
   * Sends data to the server
   * @param {any} data - Data to be sent
   * @returns {void}
   */
  public send_packet(data: any): void {
    // console.log("Client:", data);
    // fs.appendFile("./send.log", `[O ${new Date().toString()}] ${JSON.stringify(data)}\n`, () => {
    //   return;
    // });

    const packet = msgpack.encode(data);

    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(packet);
    } else {
      this.queue.push(packet);
    }

    this.history.push(packet);

    if (this.history.length > 500) {
      this.history.splice(0, this.history.length - 500);
    }

    if (data.id) this.clientId = data.id + 1;
  }

  /**
   * Used to receive messages from the server
   * @param {Buffer} data - Data received from the server
   * @returns {void}
   */
  public receive_packet(data: Buffer): void {
    const packet: any = {
      type: Number((data.slice(0, 1) as any as Buffer[])[0]),
    };

    switch (packet.type) {
      case 0x45:
        packet.data = msgpack.decode(data.slice(1));
        if (packet.data.id && typeof packet.data.id === "number") {
          packet.id = packet.data.id;
          delete packet.data.id;
        }
        break;
      case 0xae:
        packet.data = msgpack.decode(data.slice(5));
        packet.id = data.readUInt32BE(1);
        delete packet.data.id;
        break;
      case 0x58: {
        const lengths = [];

        for (let i = 0; true; i++) {
          if (data.slice(i * 4 + 1).readUInt32BE() === 0) break;

          lengths.push(data.slice(i * 4 + 1).readUInt32BE());
        }

        let pointer = 0;

        for (let i = 0; i < lengths.length; i++) {
          this.receive_packet(
            data.slice(
              1 + lengths.length * 4 + 4 + pointer,
              1 + lengths.length * 4 + 4 + pointer + lengths[i]
            )
          );

          pointer += lengths[i];
        }

        return;
      }
      case 0xb0:
        // console.log("Server:", "Pong");

        return this.heartbeat(5000);
      default:
        packet.data = msgpack.decode(data);
    }

    if (packet.id) {
      if (packet.id > this.serverId) {
        this.serverId = packet.id;
      } else return;
    }

    // console.log("Server:", packet);
    // fs.appendFile("./send.log", `[I ${new Date().toString()}] ${JSON.stringify(packet)}\n`, () => {
    //   return;
    // });

    const message = this.messages.get(packet.data.command);

    if (message) {
      message(packet.data, this);
    }
  }

  /**
   * The heartbeat function to keep the ribbon alive
   * @param {number} ms - Amount of milliseconds to wait before next heartbeat
   * @returns {void}
   */
  private heartbeat(ms: number): void {
    if (this.heartbeatTO) clearTimeout(this.heartbeatTO);

    this.heartbeatTO = setTimeout(() => {
      if (this.socket.readyState === this.socket.OPEN) {
        // console.log("Client:", "Ping");

        try {
          this.socket.send(Buffer.from([0xb0, 0x0b]));
        } catch {
          this.heartbeat(200);
        }
      } else {
        this.heartbeat(200);
      }
    }, ms);
  }

  /**
   * Migrates the client to a new server
   * @param {string} endpoint - The new endpoint URI
   * @returns {void}
   */
  public migrate(endpoint: string): void {
    if (this.heartbeatTO) clearTimeout(this.heartbeatTO);

    this.socket.close();

    this.socket = new WebSocket(endpoint);

    this.socket.onopen = () => {
      this.send_packet({
        command: "resume",
        socketid: this.socketId,
        resumetoken: this.resumeId,
      });

      this.send_packet({
        command: "hello",
        packets: this.history,
      });

      for (let i = 0; this.queue.length; i++) {
        this.send_packet(this.queue[i]);

        this.queue.splice(i, 1);
      }

      this.heartbeat(5000);
    };

    this.socket.onmessage = (e) => {
      this.receive_packet(e.data as Buffer);
    };

    this.socket.onclose = () => {
      if (this.heartbeatTO) clearTimeout(this.heartbeatTO);
    };
  }
}
