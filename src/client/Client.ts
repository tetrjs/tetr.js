import WebSocketManager from "../websocket/WebSocketManager";
import UserManager from "../user/UserManager";
import fetch from "node-fetch";
import ClientUser from "./ClientUser";
import EventEmitter from "events";

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
  public users?: UserManager = new UserManager();

  /**
   * The amount of currently online players
   * @type {number}
   * @readonly
   */
  public players: number = 0;

  // Functions

  /**
   * Used to disconnect the connection with the server
   * @returns {void}
   */
  public disconnect(): void {
    this.ws?.send_packet({ command: "die" });

    this.ws?.socket.close();

    this.players = 0;

    this.user = undefined;
    this.users = undefined;
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
      throw "Invalid Token.";
    }

    if (client.user.role !== "bot")
      throw "Client is not a bot. Apply for a bot account by messaging osk#9999 on Discord.";

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

    this.ws = new WebSocketManager(
      endpoint.success ? endpoint.endpoint : "wss://tetr.io/ribbon",
      this
    );
  }
}
