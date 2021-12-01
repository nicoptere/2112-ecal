function lerp(t, a, b) {
  return a * (1 - t) + b * t;
}

const pool = [];
export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static get(x, y) {
    if (pool.length > 0) {
      let p = pool.shift();
      p.set(x, y);
      return p;
    }
    return new Vector2(x, y);
  }

  dispose() {
    pool.push(this);
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  multiplyScalar(v) {
    this.x *= v;
    this.y *= v;
    return this;
  }

  setScalar(v) {
    this.x = v;
    this.y = v;
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  negate() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  add(x, y) {
    if (x.constructor === Vector2) {
      this.x += x.x;
      this.y += x.y;
    } else if (x.constructor === Number) {
      this.x += x;
      this.y += y;
    }
    return this;
  }

  sub(x, y) {
    if (x.constructor === Vector2) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (x.constructor === Number) {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(value = null) {
    var l = this.length;
    if (l == 0) return this;
    this.x /= l;
    this.y /= l;
    if (value != null) this.multiplyScalar(value);
    return this;
  }

  direction(other) {
    return other.clone().sub(this).normalize();
  }

  dot(p) {
    return this.x * p.x + this.y * p.y;
  }

  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  nearEquals(other, epsilon = 0.01) {
    return (
      Math.abs(other.x - this.x) < epsilon &&
      Math.abs(other.y - this.y) < epsilon
    );
  }

  midpoint(other) {
    return new Vector2((this.x + other.x) / 2, (this.y + other.y) / 2);
  }

  pointAt(t, other) {
    let p = this.clone();
    p.x = lerp(t, this.x, other.x);
    p.y = lerp(t, this.y, other.y);
    return p;
  }
}

export const V2 = Vector2;
