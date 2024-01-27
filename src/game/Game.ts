import EventEmitter from "node:events";
import Player from "./Player";
import ClientPlayer from "../client/ClientPlayer";
import WebSocketManager from "../ws/WebSocketManager";
import ClientUser from "../client/ClientUser";

export interface Leaderboard {
  player: Player;
  success: boolean;
  wins: number;
  active: boolean;
  inputs: number;
  naturalorder: number;
  piecesplaced: number;
}

export default class Game extends EventEmitter {
  constructor(ws: WebSocketManager, me: ClientUser, players: Player[]) {
    super();

    this.players = new Map(players.map((player) => [player.id, player]));

    let me_ = [...this.players.values()].find((k) => k.user.id === me.user.id);

    if (me_) this.me = new ClientPlayer(ws, me_);
  }

  public me?: ClientPlayer;

  public players: Map<string, Player>;
}

export default interface Game extends EventEmitter {
  /**  Emitted when the score updates. */
  on(eventName: "score", listener: (leaderboard: Leaderboard[], victor: Player) => void): this;
}
