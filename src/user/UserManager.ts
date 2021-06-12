import User from "./User";
import fetch from "node-fetch";
import Client from "../client/Client";
import { CacheData } from "..";

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
    const cacheUser = this.cache.get(id);
    if (cacheUser && new Date().getTime() < cacheUser.cache.cached_until)
      return cacheUser.data;

    const user = await (
      await fetch(`https://ch.tetr.io/api/users/${encodeURIComponent(id)}`, {
        headers: { "X-Session-ID": this.client.cacheSessionID },
      })
    ).json();

    if (user.success) {
      const userObject = new User(user.data.user, this.client);

      this.cache.set(user.data.user._id, {
        cache: user.cache,
        data: userObject,
      });

      return userObject;
    } else {
      return undefined;
    }
  }
}
