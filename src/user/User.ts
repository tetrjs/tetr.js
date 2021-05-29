import EventEmitter from "events";
import Client from "../client/Client";

export default class User extends EventEmitter {
  /**
   * The User Class
   * @param {any} data - The data to be patched
   * @constructor
   */
  constructor(data: any, client: Client) {
    super();

    this.client = client;
    this.patch(data);
  }

  // Variables

  /**
   * The Client Class
   * @type {Client}
   * @readonly
   */
  public client!: Client;

  public _id!: string;
  public username!: string;
  public role!: "user" | "bot" | "admin" | "anon";
  public ts?: string;
  public botmaster?: string;
  public badges!: { id: string; label: string; ts: string }[];
  public xp!: number;
  public gamesplayed!: number;
  public gametime!: number;
  public country?: string;
  public verified!: boolean;
  public supporter?: boolean;
  public supporter_tier!: number;
  public league!: {
    gamesplayed: number;
    gameswon: number;
    rating: number;
    glicko: number;
    rd?: number;
    rank:
      | "z"
      | "d"
      | "d+"
      | "c-"
      | "c"
      | "c+"
      | "b-"
      | "b"
      | "b+"
      | "a-"
      | "a"
      | "a+"
      | "s-"
      | "s"
      | "s+"
      | "ss"
      | "u"
      | "x";
    apm: number | null;
    pps: number | null;
    vs: number | null;
    decaying: boolean;
    standing: number;
    percentile: number;
    standing_local: number;
    prev_rank:
      | "z"
      | "d"
      | "d+"
      | "c-"
      | "c"
      | "c+"
      | "b-"
      | "b"
      | "b+"
      | "a-"
      | "a"
      | "a+"
      | "s-"
      | "s"
      | "s+"
      | "ss"
      | "u"
      | null;
    prev_at: number;
    next_rank:
      | "d"
      | "d+"
      | "c-"
      | "c"
      | "c+"
      | "b-"
      | "b"
      | "b+"
      | "a-"
      | "a"
      | "a+"
      | "s-"
      | "s"
      | "s+"
      | "ss"
      | "u"
      | "x"
      | null;
    next_at: number;
    percentile_rank:
      | "z"
      | "d"
      | "d+"
      | "c-"
      | "c"
      | "c+"
      | "b-"
      | "b"
      | "b+"
      | "a-"
      | "a"
      | "a+"
      | "s-"
      | "s"
      | "s+"
      | "ss"
      | "u"
      | "x";
  };
  public friend_count!: number;
  public avatar_revision?: number;
  public banner_revision?: number;
  public bio?: string;
  public badstanding?: boolean;

  // Functions

  /**
   * Patches the User data
   * @param {any} data - The data to be patched
   * @returns {void}
   */
  private patch(data: any): void {
    for (const i of Object.keys(data)) {
      // @ts-expect-error
      this[i] = data[i];
    }
  }

  /**
   * Fetches a User's avatar image
   * @returns {string}
   */
  public avatarURL(): string {
    if (this.avatar_revision) {
      return `https://tetr.io/user-content/avatars/${encodeURIComponent(
        this._id
      )}?rv=${encodeURIComponent(this.avatar_revision)}`;
    } else {
      return "https://tetr.io/res/avatar.png";
    }
  }

  /**
   * Send's a message to this user
   * @param {string} content - The message to be sent to the User
   * @returns {void}
   */
  public send(content: string): void {
    this.client.ws?.send_packet({
      command: "social.dm",
      data: { recipient: this._id, msg: content },
    });
  }
}
