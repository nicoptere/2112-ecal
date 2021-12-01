export default class Gate {
  constructor() {
    this.a = false;
    this.b = false;
  }
  pushState(state) {
    this.b = this.a;
    this.a = state;
  }
  close() {
    this.a = false;
    this.b = false;
  }
  get isIn() {
    return this.a === true && this.b === true;
  }
  get isOut() {
    return this.a === false && this.b === false;
  }
  get enters() {
    return this.a === true && this.b === false;
  }
  get exits() {
    return this.a === false && this.b === true;
  }
}
