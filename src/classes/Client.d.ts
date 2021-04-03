/**
 * @param {Handling} handling - TETR.IO handling settings.
 */
export class Client {
  /**
   * @type {string} - Client token.
   */
  public token!: string;

  /**
   * @constructor
   * @param {Handling} handling - TETR.IO handling settings.
   */
  public constructor(
    public handling: Handling = { arr: "1", das: "1", sdf: "5", safelock: true }
  );

  public social: ClientSocial;
  public room: ClientRoom;

  /**
   * @param {string} token - Token of the client.
   */
  public login(token: string): void;
  /**
   * @param {Event} event - Event to assign function to.
   * @param {Function} func - Event to emit.
   */
  public on(event: Event, func: Function): void;
}

interface Handling {
  /**
   * @param {string} arr - FLOAT [1-5]. Represents automatic repeat rate.
   * @param {string} das - FLOAT [1-8]. Represents delayed auto-shift.
   * @param {string} sdf - INT [5-41]. Represents soft-drop factor, where 41 represents infinity.
   * @param {boolean} safelock - Represents the "prevent accidental hard drops" setting.
   */
  arr: string;
  das: string;
  sdf: string;
  safelock: boolean;
}

interface ClientRoom {
  /**
   * @return {void}
   * @param {string} r - Room ID.
   */
  join(r: string): void;
  leave(): void;

  /**
   * @return {void}
   * @param {Mode} mode - Mode.
   */
  selfMode(mode: Mode): void;
  /**
   * @return {void}
   * @param {string} user - User to set.
   * @param {Mode} mode - Mode to set user.
   */
  setMode(user: string, mode: Mode): void;
  /**
   * @return {void}
   * @param {GameOptions} options - Options to change in the room.
   */
  updateSettings(options: { index: string; value: any }[]): void;
  /**
   * @return {void}
   * @param {string} message - Content of the message.
   */
  message(message: string): void;
  id?: string;
}

interface ClientSocial {
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   * @param {string} msg - Content of the message.
   */
  message(recipient: string, msg: string): void;
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   */
  invite(recipient: string): void;
  /**
   * @return {void}
   * @param {Presence} presence - Presence of the client.
   */
  presence(presence: Presence): void;
}

export type Presence = {
  status: "online" | "away" | "busy" | "offline";
  detail:
    | ""
    | "menus"
    | "40l"
    | "blitz"
    | "zen"
    | "custom"
    | "lobby_end:X-QP"
    | "lobby_spec:X-QP"
    | "lobby_ig:X-QP"
    | "lobby:X-QP"
    | "lobby_end:X-PRIV"
    | "lobby_spec:X-PRIV"
    | "lobby_ig:X-PRIV"
    | "lobby:X-PRIV"
    | "tl_mn"
    | "tl"
    | "tl_end"
    | "tl_mn_complete"
    | string;
  user?: string;
  invitable?: boolean;
};

export type Event =
  | "authorize"
  | "chat"
  | "gmupdate"
  | "joinroom"
  | "leaveroom"
  | "readymulti"
  | "refereeboard"
  | "replay"
  | "social.dm"
  | "social.invite"
  | "social.presence"
  | "social.notifcation"
  | "social.online"
  | "startmulti";

export type Mode = "player" | "spectator";
