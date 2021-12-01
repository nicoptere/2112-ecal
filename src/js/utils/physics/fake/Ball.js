import EventEmitter from "EventEmitter";
import { Vector2 } from "../../geom/Vector";

let e = new EventEmitter();
export default class Ball extends Vector2 {
  constructor(x, y, radius, friction = 0.999) {
    super();
    this.acc = new Vector2();
    this.vel = new Vector2();
    this.col = "#000";
    this.reset(x, y, radius, friction);
  }

  reset(x, y, radius, friction = 0.8) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.friction = friction;
    this._fixed = false;
    this.acc.set(0, 0);
    this.vel.set(0, 0);
  }

  set fixed(v) {
    this._fixed = v;
  }
  get fixed() {
    return this._fixed;
  }
  update() {
    if (this.fixed === false) {
      this.vel.add(this.acc);
      this.vel.multiplyScalar(this.friction);
      if (this.vel.length > 1) {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.x = ~~(this.x + 0.5);
        this.y = ~~(this.y + 0.5);
      }
      this.acc.set(0, 0);
    }
  }
  render(ctx) {
    ctx.g.circle(this.x, this.y, this.radius);
    ctx.g.disc(this.x, this.y, 2);
    ctx.strokeStyle = this.col;
    // ctx.g.line(this.x, this.y, this.x + this.vel.x, this.y + this.vel.y);
  }
}
