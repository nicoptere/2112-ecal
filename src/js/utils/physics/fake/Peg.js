import Ball from "./Ball";
export default class Peg extends Ball {
  constructor(x, y, radius, count) {
    super(x, y, radius);
    this.fixed = true;
    this.isPeg = true;
    this.steps = count;
    this.count = count;
    this.wasHit = false;
  }

  hit() {
    if (this.wasHit) this.count--;
  }

  reset(x, y, radius, count) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.count = count;
  }

  render(ctx) {
    if (this.count <= 0) return;
    let r = (this.radius / this.steps) * this.count;
    ctx.g.circle(this.x, this.y, r);
    ctx.g.text(this.count, 16, this.x - 8, this.y + 8);
  }
}
