export default class PiecesGen {
  constructor(seed: number) {
    this.startSeed = seed % 2147483647;
    this.curSeed = seed % 2147483647;
    this.curBag = 0;
  }

  public startSeed;
  public curSeed;
  public curBag;

  next() {
    return (this.curSeed = (16807 * this.curSeed) % 2147483647);
  }

  nextFloat() {
    return (this.next() - 1) / 2147483646;
  }

  nextBag(minos = ["z", "l", "o", "s", "i", "j", "t"]) {
    this.curBag++;
    let randomPiece,
      minosLeft = minos.length;

    if (minosLeft == 0) return minos;

    for (; --minosLeft; ) {
      randomPiece = Math.floor(this.nextFloat() * (minosLeft + 1));
      [minos[minosLeft], minos[randomPiece]] = [minos[randomPiece], minos[minosLeft]];
    }
    return minos;
  }

  getBag(bag: number, toString = true) {
    if (bag < 1 || bag > 10000)
      return {
        success: false,
        error: bag < 1 ? "Bag count under 1!" : "Too many bags into the future!",
      };

    const gen = new PiecesGen(this.startSeed);
    let wantedBag = undefined;

    while (gen.curBag != bag) wantedBag = gen.nextBag();

    return toString
      ? {
          success: true,
          data: (wantedBag || []).join(""),
        }
      : {
          success: true,
          data: [wantedBag],
        };
  }
}
