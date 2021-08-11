import Room from "../room/Room";
import User from "../user/User";
import Client from "../client/Client";
import { Handling, Presence } from "..";
import { DirectMessage } from "..";

export default class ClientUser extends User {
  constructor(data: any, client: Client) {
    super(data, client);
  }

  // Variables

  /**
   * The ClientUser's handling
   * @type {Handling}
   * @readonly
   */
  public handling!: Handling;

  /**
   * The room the ClientUser is in
   * @type {Room}
   * @readonly
   */
  public room?: Room;

  // Functions

  /**
   * Joins a room
   * @param {string} room - The Room ID to join
   * @returns {void}
   */
  public join(room: string): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "joinroom",
      data: room,
    });
  }

  /**
   * Leaves a room
   * @returns {void}
   */
  public leave(): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "leaveroom",
      data: false,
    });
  }

  /**
   * Sets the ClientUser's presence
   * @param {Presence} data - The presence data for the ClientUser
   * @returns {void}
   */
  public setPresence(data: Presence): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "social.presence",
      data,
    });
  }

  /**
   * Creates a new Room
   * @param {boolean} discoverable - Whether or not the room should be public
   * @returns {void}
   */
  public createRoom(discoverable: boolean): void {
    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "createroom",
      data: discoverable ? "public" : "private",
    });
  }

  /**
   * Set the client user's handling settings.
   * @param {Handling} handling - The handling options you want to set.
   * @returns {void}
   */
  public setHandling(handling: Handling): void {
    this.handling = handling;

    this.client.ws?.send_packet({
      id: this.client.ws.clientId,
      command: "sethandling",
      data: handling
    });
  }
}

export default interface ClientUser {
  /**
   * Emitted when the ClientUser joins a room
   */
  on(event: "join", callback: () => void): this;

  /**
   * Emitted when the ClientUser leaves a room
   */
  on(event: "leave", callback: () => void): this;

  /**
   * Emitted when the ClientUser receives a message from another User
   */
  on(event: "message", callback: (message: DirectMessage) => void): this;

  /**
   * Emitted when the ClientUser is invited to a room
   */
  on(
    event: "invite",
    callback: (data: { author: User; room: { id: string; name: string } }) => void
  ): this;
}
