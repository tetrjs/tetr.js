import Room from "../room/Room";
import User from "../user/User";
import Client from "../client/Client";

export default class ClientUser extends User {
  constructor(data: any, client: Client) {
    super(data);

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
   * The ClientUser's handling
   * @type {any}
   * @readonly
   */
  public handling!: any;

  /**
   * The room the ClientUser is in
   * @type {Room}
   * @readonly
   */
  public room?: Room;

  // Functions

  /**
   * Sets the ClientUser's presence
   * @type {Object}
   */
  public setPresence(data: {
    status: "online" | "away" | "busy" | "offline";
    detail:
      | ""
      | "menus"
      | "40l"
      | "zen"
      | "custom"
      | "lobby_end:X-QP"
      | "lobby_spec:X_QP"
      | "lobby_ig:X-QP"
      | "lobby_end:X-PRIV"
      | "lobby_spec:X_PRIV"
      | "lobby_ig:X-PRIV"
      | "tl_mm"
      | "tl"
      | "tl_end"
      | "tl_mm_complete";
  }): void {
    this.client.ws.send_packet({ command: "social.presence", data });
  }
}
