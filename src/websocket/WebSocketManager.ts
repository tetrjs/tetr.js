import WebSocket from "ws";
import Client from "../client/Client";
import * as msgpackr from "msgpackr";
import fs from "fs";
import { EventEmitter } from "stream";

const RIBBON_BATCH_TIMEOUT = 25;
const RIBBON_CACHE_EVICTION_TIME = 25000;

const RIBBON_EXTRACTED_ID_TAG = new Uint8Array([174]);
const RIBBON_STANDARD_ID_TAG = new Uint8Array([69]);
const RIBBON_BATCH_TAG = new Uint8Array([88]);
const RIBBON_EXTENSION_TAG = new Uint8Array([0xb0]);

const RIBBON_EXTENSIONS = new Map();
RIBBON_EXTENSIONS.set(0x0b, (payload: Buffer) => {
  if (payload.byteLength >= 6) {
    return { command: "ping", at: new DataView(payload.buffer).getUint32(2, false) };
  } else {
    return { command: "ping" };
  }
});
RIBBON_EXTENSIONS.set("PING", (extensionData: any) => {
  if (typeof extensionData === "number") {
    const dat = Buffer.from([0xb0, 0x0b, 0x00, 0x00, 0x00, 0x00]);
    new DataView(dat.buffer).setUint32(2, extensionData, false);
    return dat;
  } else {
    return Buffer.from([0xb0, 0x0b]);
  }
});
RIBBON_EXTENSIONS.set(0x0c, (payload: Buffer) => {
  if (payload.byteLength >= 6) {
    return { command: "pong", at: new DataView(payload.buffer).getUint32(2, false) };
  } else {
    return { command: "pong" };
  }
});
RIBBON_EXTENSIONS.set("PONG", (extensionData: any) => {
  if (typeof extensionData === "number") {
    const dat = Buffer.from([0xb0, 0x0c, 0x00, 0x00, 0x00, 0x00]);
    new DataView(dat.buffer).setUint32(2, extensionData, false);
    return dat;
  } else {
    return Buffer.from([0xb0, 0x0c]);
  }
});

const globalRibbonPackr = new msgpackr.Packr({
  bundleStrings: false,
});
const globalRibbonUnpackr = new msgpackr.Unpackr({
  bundleStrings: false,
});

export default class WebSocketManager extends EventEmitter {
  /**
   * The WebSocketManager Class
   * @param {string} endpoint - The endpoint of the server to connect to
   * @param {string} token - The token to connect to the WebSocket
   * @param {Client} client - The Client Class
   */
  constructor(endpoint: string, token: string, client: Client) {
    super();
    this.lastPong = Date.now();
    this.packr = new msgpackr.Packr({
      bundleStrings: false,
    });
    this.unpackr = new msgpackr.Unpackr({
      bundleStrings: false,
      structures: [],
    });

    this.client = client;

    // TODO use spool token
    (async () => {
      this.socket = new WebSocket(endpoint, token);

      this.socket.onopen = () => {
        this.send_packet({ command: "new" }, true);

        this.heartbeat();
      };

      this.socket.onmessage = (e) => {
        this.receive_packet(e.data as Buffer);
      };

      this.socket.onclose = () => {
        if (this.heartbeatTO) clearTimeout(this.heartbeatTO);
      };
    })();
  }

  /**
   * Private sequential packr
   * @type {msgpackr.Packr}
   */
  private packr: msgpackr.Packr;

  /**
   * Private sequential unpackr
   * @type {msgpackr.Unpackr}
   */
  private unpackr: msgpackr.Unpackr;

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
  /**
   * The last pong
   * @type {number}
   */
  private lastPong: number;

  // Functions

  /**
   * Sends data to the server
   * @param {any} data - Data to be sent
   * @param {boolean} useSequential - Should the function use the sequential msgpackr instance
   * @param {any} extensionData - Data to be used for a custom extension
   * @returns {void}
   */
  public send_packet(data: any, useSequential = false, extensionData?: any): void {
    // console.log("Client:", data);
    // fs.appendFile("./send.log", `[O ${new Date().toString()}] ${JSON.stringify(data)}\n`, () => {
    //   return;
    // });

    // if (typeof data === "string") {
    //   const found = RIBBON_EXTENSIONS.get(data);
    //   if (found) {
    //     encoded = found(extensionData);
    //   }
    // }

    // if (!encoded) {
    // const prependable = RIBBON_STANDARD_ID_TAG;

    const msgpacked = (useSequential ? this.packr : globalRibbonPackr).pack(data);
    const encoded = Buffer.concat([RIBBON_STANDARD_ID_TAG, msgpacked]);
    // }

    // // TODO: send the packets, currently encoded is the variable with the packets

    // TODO: Follow tetrio.js implementation, CC: @Proximitynow19

    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(encoded);
    } else {
      this.queue.push(encoded);
    }

    this.history.push(encoded);

    if (this.history.length > 500) {
      this.history.splice(0, this.history.length - 500);
    }

    if (data.id) this.clientId = data.id + 1;
  }

  /**
   * Used to receive messages from the server
   * @param {Buffer | any} data - Data received from the server
   * @param {boolean} useSequential - Should the function use the sequential msgpackr instance
   * @returns {void}
   */
  public receive_packet(data: Buffer | any, useSequential = false): void {
    let packet: any;
    if (Buffer.isBuffer(data)) {
      packet = {
        type: Number((data.slice(0, 1) as any as Buffer[])[0]),
      };

      switch (packet.type) {
        case RIBBON_EXTENSION_TAG[0]:
          {
            // look up this extension
            const found = RIBBON_EXTENSIONS.get(packet[1]);
            if (!found) {
              return; //! No clue what to do here, just return or something
            }
            packet.data = found(packet);

            if (packet.data.id && typeof packet.data.id === "number") {
              packet.id = packet.data.id;
              delete packet.data.id;
            }

            if (packet.data.command == "pong") this.lastPong = Date.now();
          }
          break;
        case RIBBON_STANDARD_ID_TAG[0]:
          // simply extract
          packet.data = this.hybridUnpack(data.slice(1), useSequential);

          packet.id = data.readUInt32BE(1);
          delete packet.data.id;
          break;
        case RIBBON_EXTRACTED_ID_TAG[0]:
          {
            // extract id and msgpacked, then inject id back in
            // these don't support sequential!
            const object = globalRibbonUnpackr.unpack(data.slice(5));
            const view = new DataView(data.buffer);
            const id = view.getUint32(1, false);
            object.id = id;
            packet.data = object;
          }
          break;
        case RIBBON_BATCH_TAG[0]: {
          // ok these are complex, keep looking through the header until you get to the (uint32)0 delimiter
          const lengths = [];
          const view = new DataView(packet.buffer);

          // Get the lengths
          for (let i = 0; true; i++) {
            const length = view.getUint32(1 + i * 4, false);
            if (length === 0) {
              // We've hit the end of the batch
              break;
            }
            lengths.push(length);
          }

          // Get the items at those lengths
          let pointer = 0;
          for (let i = 0; i < lengths.length; i++) {
            this.receive_packet(
              packet.slice(
                1 + lengths.length * 4 + 4 + pointer,
                1 + lengths.length * 4 + 4 + pointer + lengths[i]
              ),
              useSequential
            );
            pointer += lengths[i];
          }

          return;
        }
        default:
          packet.data = this.hybridUnpack(data, useSequential);
          break;
      }
    } else {
      packet = data;
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
    this.emit("raw", packet.data.command, packet.data, this);
  }

  private hybridUnpack(packet: Buffer, useSequential: boolean) {
    if (useSequential) {
      return (this.unpackr.unpackMultiple(packet) as any)[0];
    } else {
      return globalRibbonUnpackr.unpack(packet);
    }
  }

  /**
   * The heartbeat function to keep the ribbon alive
   * @returns {void}
   */
  private heartbeat(): void {
    if (this.heartbeatTO) clearTimeout(this.heartbeatTO);

    if (this.socket.readyState !== this.socket.OPEN) {
      return void setTimeout(this.heartbeat, 200);
    }
    this.heartbeatTO = setInterval(() => {
      if (this.socket.readyState === this.socket.OPEN) {
        // console.log("Client:", "Ping");

        if (Date.now() - this.lastPong > 30000) {
          // TODO: Handle this eventually
        }

        try {
          this.socket.send(Buffer.from([0xb0, 0x0b]));
        } catch {
          return;
        }
      }
    }, 5000);
  }

  /**
   * Migrates the client to a new server
   * @param {string} endpoint - The new endpoint URI
   * @returns {void}
   */
  public async migrate(endpoint: string): Promise<void> {
    if (this.heartbeatTO) clearTimeout(this.heartbeatTO);

    this.socket.close();

    this.socket = new WebSocket(
      endpoint,
      await this.client.api.getSpoolToken().catch(() => this.migrate(endpoint))
    );

    this.socket.onopen = () => {
      this.send_packet(
        {
          command: "resume",
          socketid: this.socketId,
          resumetoken: this.resumeId,
        },
        true
      );

      this.send_packet(
        {
          command: "hello",
          packets: this.history,
        },
        true
      );

      for (let i = 0; this.queue.length; i++) {
        this.send_packet(this.queue[i]);

        this.queue.splice(i, 1);
      }

      this.heartbeat();
    };

    this.socket.onmessage = (e) => {
      this.receive_packet(e.data as Buffer);
    };

    this.socket.onclose = () => {
      if (this.heartbeatTO) clearTimeout(this.heartbeatTO);
    };
  }
}

export default interface WebSocketManager {
  /**
   * Emitted whenever a packet gets received
   */
  on(event: "raw", callback: (command: string, packet: any, ws: WebSocketManager) => any): this;
}
