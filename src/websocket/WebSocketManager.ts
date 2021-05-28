import WebSocket from "ws";
import Client from "../client/Client";
import msgpack from "msgpack-lite";
import fs from "fs";

export default class WebSocketManager extends WebSocket {
  /**
   * The WebSocketManager Class
   * @param {string} endpoint - The endpoint of the server to connect to
   * @param {Client} client - The Client Class
   */
  constructor(endpoint: string, client: Client) {
    super(endpoint);

    this.client = client;

    this.onopen = () => {
      this.send_packet({ command: "new" });

      this.heartbeat(5000);
    };

    this.onmessage = (e) => {
      this.receive_packet(e.data as Buffer);
    };
  }

  // Variables

  /**
   * The Client
   * @type {Client}
   */
  public client!: Client;

  /**
   * WebSocket messages
   * @type {Map<string, Function>}
   */
  private messages: Map<string, Function> = new Map(
    fs
      .readdirSync(`${__dirname}/messages`)
      .filter((k) => k.endsWith(".js"))
      .map((k: string) => [
        k.slice(0, -3),
        require(`${__dirname}/messages/${k}`),
      ])
  );

  /**
   * The current ServerId
   * @type {number}
   */
  public serverId: number = 0;

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
  public clientId: number = 1;

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
    // console.log(data);

    const packet = msgpack.encode(data);

    if (this.readyState === this.OPEN) {
      this.send(packet);
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
        break;
      case 0xae:
        packet.data = msgpack.decode(data.slice(5));
        packet.data.id = data.readUInt32BE(1);
        break;
      case 0x58:
        var lengths = [];

        for (var i = 0; true; i++) {
          if (data.slice(i * 4 + 1).readUInt32BE() === 0) break;

          lengths.push(data.slice(i * 4 + 1).readUInt32BE());
        }

        var pointer = 0;

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
      case 0xb0:
        // console.log("Pong");

        return this.heartbeat(5000);
      default:
        packet.data = msgpack.decode(data);
    }

    if (!packet.data || (packet.data.id && packet.data.id <= this.serverId))
      return;

    if (packet.data.id) this.serverId = packet.data.id;

    console.log(packet);

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
      if (this.readyState === this.OPEN) {
        // console.log("Ping");

        try {
          this.send(Buffer.from([0xb0, 0x0b]));
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

    // this.onopen;

    this.url = endpoint;

    for (var i = 0; this.queue.length; i++) {
      this.send_packet(this.queue[i]);

      this.queue.splice(i, 1);
    }

    this.send_packet({
      command: "resume",
      socketid: this.socketId,
      resumetoken: this.resumeId,
    });

    this.send_packet({
      command: "hello",
      packets: this.history,
    });

    this.heartbeat(5000);
  }
}
