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

  /**
   * The ID of the User
   * @type {string}
   * @readonly
   */
  public _id!: string;

  /**
   * The username of the User
   * @type {string}
   * @readonly
   */
  public username!: string;

  /**
   * The role of the User
   * @type {string}
   * @readonly
   */
  public role!: "user" | "bot" | "admin" | "anon";

  /**
   * When the User was created
   * @type {string}
   * @readonly
   */
  public ts?: string;

  /**
   * The botmaster(s) of the User
   * @type {string}
   * @readonly
   */
  public botmaster?: string;

  /**
   * The bagdes the User has earned
   * @type {any[]}
   * @readonly
   */
  public badges!: { id: string; label: string; ts: string }[];

  /**
   * The amount of xp the User has
   * @type {number}
   * @readonly
   */
  public xp!: number;

  /**
   * The amount of games the user has played
   * @type {number}
   * @readonly
   */
  public gamesplayed!: number;

  /**
   * How long the User has played in matches
   * @type {number}
   * @readonly
   */
  public gametime!: number;

  /**
   * The country code of the User
   * @type {number}
   * @readonly
   */
  public country?: string;

  /**
   * Whether or not the user is verified
   * @type {boolean}
   * @readonly
   */
  public verified!: boolean;

  /**
   * Whether or not the User is supporting TETR.IO
   * @type {boolean}
   * @readonly
   */
  public supporter?: boolean;

  /**
   * The current supporter teir for the User
   * @type {number}
   * @readonly
   */
  public supporter_tier!: number;

  /**
   * The User's current Tetra League statistics
   * @type {any}
   * @readonly
   */
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

  /**
   * The amount of people who have friended the User
   * @type {number}
   * @readonly
   */
  public friend_count!: number;

  /**
   * The User's unique avatar identifier
   * @type {number}
   * @readonly
   */
  public avatar_revision?: number;

  /**
   * The User's unique banner identifier
   * @type {number}
   * @readonly
   */
  public banner_revision?: number;

  /**
   * The User's bio if they have one
   * @type {string}
   * @readonly
   */
  public bio?: string;

  /**
   * Whether or not the User has been recently banned
   * @type {boolean}
   * @readonly
   */
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
