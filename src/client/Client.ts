import WebSocketManager from "../ws/WebsocketManager";
import ClientUser from "./ClientUser";
import api from "../util/api";
import UserManager from "../user/UserManager";
import EventEmitter from "node:events";

export default class Client extends EventEmitter {
  private ws = new WebSocketManager(this);

  public token?: string;
  public me?: ClientUser;
  public users = new UserManager(this);

  public async login(token: string): Promise<void> {
    this.token = token;

    let me = await api("/users/me", token);

    this.me = new ClientUser(me, await this.users.fetch(me.user._id));

    await this.ws.connect();
  }

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
