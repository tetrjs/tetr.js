import User from "./User";
import Client from "../client/Client";
import { CacheData } from "..";
import { TetraChannel } from "../channel/Channel";

export default class UserManager {
  constructor(client: Client) {
    this.client = client;
  }

  // Variables

  /**
   * The Client Class
   * @type {Client}
   * @readonly
   */
  private client!: Client;

  /**
   * The User cache
   * @type {Map<string, CacheData>}
   */
  public cache: Map<string, CacheData> = new Map();

  // Functions

  /**
   * Fetch a User
   * @param {string} id - The User's ID
   * @returns {Promise<User | undefined>}
   */
  public async fetch(id: string): Promise<User | undefined> {
    let userObject;
    await TetraChannel.users
      .infos(id)
      .then((userInfo) => (userObject = new User(userInfo, this.client)))
      .catch(() => (userObject = undefined));

    return userObject;
  }
}
