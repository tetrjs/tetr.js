import WebSocketManager from "../websocket/WebSocketManager";
import UserManager from "../user/UserManager";
import fetch from "node-fetch";
import ClientUser from "./ClientUser";
import EventEmitter from "events";
import { Worker } from "..";

export default class Client extends EventEmitter {
  /**
   * The Client Class
   * @constructor
   */
  constructor() {
    super();
  }

  // Variables

  /**
   * The WebSocketManager
   * @type {WebSocketManager}
   * @readonly
   */
  public ws?: WebSocketManager;

  /**
   * The client's token
   * @type {string}
   * @readonly
   */
  public token!: string;

  /**
   * The ClientUser
   * @type {ClientUser}
   * @readonly
   */
  public user?: ClientUser;

  /**
   * The UserManager
   * @type {UserManager}
   * @readonly
   */
  public users: UserManager = new UserManager(this);

  /**
   * The amount of currently online players
   * @type {number}
   * @readonly
   */
  public players = 0;

  /**
   * The commitId of the latest build of TETR.IO
   * @type {string}
   * @readonly
   */
  public commitId = "";

  // Functions

  /**
   * Used to disconnect the connection with the server
   * @returns {void}
   */
  public disconnect(): void {
    this.ws?.send_packet({ command: "die" });
    this.ws?.socket.close();

    this.token = "";
    this.user = undefined;
    this.players = 0;
    this.commitId = "";
  }

  /**
   * Login to the client's account
   * @param {string} token - The client's token
   * @returns {Promise<void>}
   */
  public async login(token: string): Promise<void> {
    this.token = token;

    const client = await (
      await fetch("https://tetr.io/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();

    if (!client.success) {
      this.emit("err", {
        fatal: true,
        reason: "Invalid Token.",
      });

      return this.disconnect();
    }

    if (client.user.role !== "bot") {
      this.emit("err", {
        fatal: true,
        reason: "Client is not a bot. Apply for a bot account by messaging osk#9999 on Discord.",
      });

      return this.disconnect();
    }

    this.user = new ClientUser(
      {
        ...(await this.users?.fetch(client.user._id)),
      },
      this
    );

    const endpoint = await (
      await fetch("https://tetr.io/api/server/ribbon", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();

    const environment = await (await fetch("https://tetr.io/api/server/environment")).json();

    if (!environment.success) {
      this.emit("err", {
        fatal: true,
        reason: "Unable to get current Commit ID.",
      });

      this.disconnect();
    } else {
      this.commitId = environment.signature.commit.id;

      this.ws = new WebSocketManager(
        endpoint.success ? endpoint.endpoint : "wss://tetr.io/ribbon",
        this
      );
    }
  }
}

export default interface Client {
  /**
   * Emitted when the Client is online
   */
  on(event: "ready", callback: () => void): this;

  /**
   * Emitted whenever the Client is force to migrate to another server
   */
  on(event: "migrate", callback: (worker: Worker) => void): this;

  /**
   * Emitted whenever the Client successfully migrates to another server
   */
  on(event: "migrated", callback: (worker: Worker) => void): this;

  /**
   * Emitted whenever the amount of online players on TETR.IO changes
   */
  on(event: "playerCount", callback: (count: number) => void): this;

  /**
   * Emitted whenever an error occurs
   */
  on(event: "err", callback: (error: { fatal: boolean; reason: string }) => void): this;
}
