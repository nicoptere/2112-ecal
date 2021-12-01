import { Vector2 } from "../geom/Vector";
class Particle extends Vector2 {
  constructor(color) {
    super(0, 0);
    this.color = color;
    this.acc = new Vector2();
    this.vel = new Vector2();
    this.path = [];
  }
  reset() {
    this.set(0, 0);
    this.acc.set(0, 0);
    this.vel.set(0, 0);
    this.size = 2 + ~~(Math.random() * 4);
    this.path = [];
  }

  render(ctx) {
    this.path.push([this.x, this.y]);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(
    //   this.x - this.size / 2,
    //   this.y - this.size / 2,
    //   this.size,
    //   this.size
    // );
    // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // ctx.fill();
    ctx.lineWidth = this.size / 2;
    ctx.beginPath();
    for (let i = 0; i < this.path.length; i++) {
      let p = this.path[i];
      ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
    // trail
    if (this.path.length > 3) this.path.shift();
  }
}
let _canvas, ctx;
let pool = [];
const gravity = 0.42;
let instances = [];
export default class Fireworks {
  constructor(canvas) {
    _canvas = canvas;
    ctx = canvas.getContext("2d");
    instances.push(this);
  }

  ignite(cx, cy, color, count = 10) {
    count = Math.min(30, count);
    while (pool.length < count) {
      pool.push(new Particle());
    }
    while (pool.length > count) pool.pop();
    let strength = 2;
    pool.forEach((p) => {
      p.reset();
      p.color = color;
      p.set(cx, cy);
      p.acc.x = (Math.random() - 0.5) * strength;
      p.acc.y = -3 + (Math.random() - 0.5) * strength;
      p.vel.set(0, 0);
    });
  }

  render(ctx) {
    pool.forEach((p) => {
      p.acc.y += gravity * (p.size * 0.25);
      // p.acc.x += Math.random() - 0.5;
      p.vel.add(p.acc);
      p.vel.multiplyScalar(0.95);
      p.x += p.vel.x;
      p.y += p.vel.y;
      p.render(ctx);
    });
  }

  static render(ctx) {
    ctx.save();
    instances.forEach((f) => {
      f.render(ctx);
    });
    ctx.restore();
  }
}
