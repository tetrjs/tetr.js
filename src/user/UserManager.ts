import User from "./User";
import fetch from "node-fetch";
import Client from "../client/Client";

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
   * @type {Map<string, User>}
   */
  public cache: Map<string, User> = new Map();

  // Functions

  /**
   * Fetch a User
   * @param {string} id - The User's ID
   * @param {boolean} force - Weather to override the cache or not
   * @returns {Promise<User | undefined>}
   */
  public async fetch(
    id: string,
    force: boolean = false
  ): Promise<User | undefined> {
    if (!force && this.cache.has(id)) return this.cache.get(id);

    const user = await (
      await fetch(`https://ch.tetr.io/api/users/${encodeURIComponent(id)}`)
    ).json();

    if (user.success) {
      this.cache.set(user.data.user._id, user.data.user as User);

      return new User(user.data.user, this.client);
    } else {
      return undefined;
    }
  }
}
