import WebSocketManager from "../ws/WebsocketManager";
import ClientUser from "./ClientUser";
import api from "../util/api";
import Room from "../Room/Room";
import User from "../user/User";

export default class Client {
  public ws = new WebSocketManager(this);
  public token?: string;
  public me?: ClientUser;
  public room = new Room(this.ws);

  public async login(token: string): Promise<void> {
    this.token = token;

    let me = await api("/users/me", token);

    this.me = new ClientUser(this.ws, me, await User.fetch(this, me.user._id));

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
