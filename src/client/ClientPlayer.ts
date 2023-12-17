import { EventEmitter } from "ws";
import Player from "../game/Player";

export default class ClientPlayer extends EventEmitter {
  constructor(player: Player) {
    super();

    this.player = player;
  }

  public player: Player;
}

export default interface ClientPlayer extends EventEmitter {
  on(eventName: "start", listener: (me: ClientPlayer) => void): this;
}
