import EventEmitter from "node:events";
import Player from "./Player";
import ClientUser from "../client/ClientUser";

export default class Game extends EventEmitter {
  constructor(me: ClientUser, players: any) {
    super();

    this.players = new Map(
      players.map((player: any) => [player.userid, new Player(player)])
    );

    this.me_ = me;
  }

  private me_: ClientUser;

  public players: Map<string, Player>;

  public get me(): Player | undefined {
    return this.players.get(this.me_.user.id);
  }
}
