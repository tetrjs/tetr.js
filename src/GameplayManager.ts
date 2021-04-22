export function find(e: number) {
  let t = e % 2147483647;
  return (
    t <= 0 && (t += 2147483646),
    {
      next: function () {
        return (t = (16807 * t) % 2147483647);
      },
      nextFloat: function () {
        return (this.next() - 1) / 2147483646;
      },
      shuffleArray: function (e: number[]) {
        let t,
          a = e.length;
        if (0 == a) return e;
        for (; --a; )
          (t = Math.floor(this.nextFloat() * (a + 1))),
            ([e[a], e[t]] = [e[t], e[a]]);
        return e;
      },
      getCurrentSeed: function () {
        return t;
      },
    }
  );
}

export function bagFunctions(input: any) {
  const minotypes = ["z", "l", "o", "s", "i", "j", "t"];
  const values = input;
  function a() {
    let e = [];
    switch (values.bagtype) {
      case "total mayhem":
        for (let a = 0; a < 7; a++)
          e.push(
            minotypes[Math.floor(values.rng.nextFloat() * minotypes.length)]
          );
        break;
      case "classic":
        for (let a = 0; a < 7; a++) {
          let a = Math.floor(values.rng.nextFloat() * (minotypes.length + 1));
          (a === values.lastGenerated || a >= minotypes.length) &&
            (a = Math.floor(values.rng.nextFloat() * minotypes.length)),
            (values.lastGenerated = a),
            e.push(minotypes[a]);
        }
        break;
      case "pairs":
        const a = [...minotypes];
        values.rng.shuffleArray(a),
          (e = [a[0], a[0], a[0], a[1], a[1], a[1]]),
          values.rng.shuffleArray(e);
        break;
      case "14-bag":
        (e = [...minotypes, ...minotypes]), values.rng.shuffleArray(e);
        break;
      case "7-bag":
      default:
        (e = [...minotypes]), values.rng.shuffleArray(e);
    }
    values.bag.push(...e);
  }
  return {
    PopulateBag: function () {
      for (; values.bag.length < 7; ) a();
      return values.bag;
    },
    PullFromBag: function () {
      for (; values.bag.length < 7; ) a();
      return values.bag.shift();
    },
  };
}
