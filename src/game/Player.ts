import User from "../user/User";

export default class Player {
  constructor(player: any, user: User) {
    this.id = player.gameid;
    this.user = user;
    this.options = player.options;
    this.board = new Array(
      player.options.boardheight + player.options.boardbuffer
    ).fill(new Array(player.options.boardwidth).fill(null));
  }

  public id: string;
  public user: User;
  public options: any;
  public board: any;
}
