import { Vector2 } from "./Vector";

export default class Transform {
  constructor(position = new Vector2(), rotation = 0, scale = 1) {
    this.__position = position;
    this.__rotation = rotation;
    this.__scale = !isNaN(scale) ? new Vector2(scale, scale) : scale;
  }

  set position(p) {
    this.__position = p;
  }
  get position() {
    return this.__position;
  }

  set rotation(r) {
    this.__rotation = r;
  }
  get rotation() {
    return this.__rotation;
  }

  set scale(s) {
    this.__scale = s;
  }
  get scale() {
    return this.__scale;
  }

  transformContext(ctx) {
    let tx = this.position.x;
    let ty = this.position.y;
    let cos = Math.cos(this.rotation);
    let sin = Math.sin(this.rotation);
    let sx = this.scale.x;
    let sy = this.scale.y;
    ctx.setTransform(cos * sx, -sin * sx, sin * sy, cos * sy, tx, ty);
  }
}
