import EventEmitter from "node:events";
import Player from "./Player";
import ClientPlayer from "../client/ClientPlayer";
import WebSocketManager from "../ws/WebSocketManager";
import ClientUser from "../client/ClientUser";

export default class Game extends EventEmitter {
  constructor(ws: WebSocketManager, me: ClientUser, players: Player[]) {
    super();

    this.players = new Map(players.map((player) => [player.user.id, player]));

    let me_;

    if ((me_ = this.players.get(me.user.id)))
      this.me = new ClientPlayer(ws, me_);
  }

  public me?: ClientPlayer;

  public players: Map<string, Player>;
}
