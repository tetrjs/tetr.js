import EventEmitter from "node:events";
import Player from "./Player";
import ClientUser from "../client/ClientUser";
import ClientPlayer from "../client/ClientPlayer";

export default class Game extends EventEmitter {
  constructor(me: ClientUser, players: Player[]) {
    super();

    this.players = new Map(players.map((player) => [player.id, player]));

    this.me_ = me;
  }

  private me_: ClientUser;

  public players: Map<string, Player>;

  public get me(): ClientPlayer | undefined {
    let me;

    if (!(me = this.players.get(this.me_.user.id))) return;

    return new ClientPlayer(me);
  }
}
