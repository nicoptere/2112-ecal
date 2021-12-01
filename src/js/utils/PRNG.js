import Alea from "alea";
let seed = 1;
let state;
class prng {
  constructor(value = 1) {
    seed = value;
    this.alea = new Alea(seed);
  }

  random() /* return next random number */ {
    return this.alea();
  }

  reset() {
    this.alea.importState(state);
  }

  setSeed(value = null) {
    seed = value;
    this.alea = new Alea(seed);
    state = this.alea.exportState();
  }
  nextSeed() {
    this.setSeed(++seed);
  }
  getSeed() {
    return seed;
  }
}
export const PRNG = new prng();

const twister = (c, a) => {
  c +
    a *
      ((Math.sqrt(-2 * Math.log2(PRNG.random())) *
        Math.cos(2 * Math.PI * PRNG.random())) /
        Math.PI);
};
