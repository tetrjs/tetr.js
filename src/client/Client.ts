import WebSocketManager from "../ws/WebsocketManager";
import ClientUser from "./ClientUser";
import api from "../util/api";
import Room from "../Room/Room";
import User from "../user/User";

/**
 * Represents the client.
 */
export default class Client {
  /**
   * A tunnel for interacting with the Ribbon.
   *
   */
  public readonly ws = new WebSocketManager(this);
  /**
   * The client's token.
   */
  public token?: string;
  /**
   * Details and actions that relate to the client's user.
   */
  public me?: ClientUser;
  /**
   * Details about the current room.
   *
   * @readonly
   */
  public readonly room = new Room(this.ws);

  /**
   * Login with a authentication token.
   * @param token - The authentication token
   *
   * @example
   * ```
   * await client.login(process.env.TOKEN);
   * ```
   */
  public async login(token: string): Promise<void> {
    this.token = token;

    let me = await api("/users/me", token);

    this.me = new ClientUser(this.ws, me, await User.fetch(this, me.user._id));

    await this.ws.connect();
  }

  /**
   * Login with a username/password combo.
   * @param username - The username of the account
   * @param password - The password of the account
   *
   * @example
   * ```
   * await client.login_password(process.env.USERNAME, process.env.PASSWORD);
   * ```
   *
   * @remarks
   *
   * A "user" account must not be used and a "bot" account is required. To obtain one, contact [osk](https://osk.sh/).
   */
  public async login_password(
    username: string,
    password: string
  ): Promise<void> {
    let auth = await api(
      "/users/authenticate",
      undefined,
      { "Content-Type": "application/json" },
      "POST",
      { username, password }
    );

    await this.login(auth.token);
  }
}
