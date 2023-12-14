import Client from "../client/Client";
import channelApi from "../util/channelApi";
import User from "./User";

export default class UserManager {
  constructor(client: Client) {}

  public async fetch(user: string): Promise<User> {
    let _0 = await channelApi(`/users/${user}`);

    return new User(_0);
  }
}
