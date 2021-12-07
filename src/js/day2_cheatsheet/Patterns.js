import { Vector2 } from "../utils/geom/Vector";
import Graphics from "../utils/gfx/Graphics";
let greyscale = [
  "f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#212529",
];

export default class Patterns {
  constructor(w, h, palette = undefined) {
    this.ctx = Graphics.getContext(w, h);
    this.g = new Graphics(this.ctx);
    this.canvas = this.ctx.canvas;
    this.setSize(w, h);
    this.palette = palette || greyscale;
  }

  setSize(w, h) {
    this.g.setSize(w, h);
    this.w = w;
    this.h = h;
    this.left = new Vector2(0, h / 2);
    this.top = new Vector2(w / 2, 0);
    this.right = new Vector2(w, h / 2);
    this.bottom = new Vector2(w / 2, h);

    this.tl = new Vector2(0, 0); // top left
    this.bl = new Vector2(0, h); // bottom left
    this.tr = new Vector2(w, 0); // top right
    this.br = new Vector2(w, h); // bottom right
    this.anchors = [
      this.tl,
      this.top,
      this.tr,
      this.right,
      this.br,
      this.bottom,
      this.bl,
      this.left,
    ];
    this.axes = {
      top: [this.tl, this.tr],
      right: [this.tr, this.br],
      bottom: [this.br, this.bl],
      left: [this.bl, this.tl],
    };
    this.diagonals = [
      [this.tl, this.br],
      [this.bl, this.tr],
    ];
  }

  //let's go nuts!

  dots(col, row, recursive = false, radius = null) {
    let g = this.g;
    g.fillStyle = this.nextColour();
    g.ctx.fillRect(0, 0, this.w, this.h);
    let id, c0, c1;
    if (recursive) {
      id = 0;
      c0 = this.nextColour();
      c1 = this.nextColour();
    } else {
      g.fillStyle = this.nextColour();
    }
    let sx = ~~(this.w / col);
    let sy = ~~(this.h / row);
    radius = radius || Math.min(sx, sy) * 0.38;
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        let x = i * sx + sx * 0.5;
        let y = j * sy + sy * 0.5;
        let r = radius;
        g.fillStyle = c0;
        g.disc(x, y, r);
        if (recursive) {
          while (r > 2) {
            g.fillStyle = ++id % 2 ? c0 : c1;
            g.disc(x, y, r);
            r -= sx / 4;
          }
        }
      }
    }
  }

  checker(col, row, recursive = false) {
    let g = this.g;
    const c0 = this.nextColour();
    const c1 = this.nextColour();
    let c2;
    if (recursive) c2 = this.nextColour();
    let id = 0;
    let sx = ~~(this.w / col + 0.5);
    let sy = ~~(this.h / row + 0.5);
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        let x = i * sx;
        let y = j * sy;
        g.fillStyle = id++ % 2 ? c0 : c1;
        g.ctx.fillRect(x, y, sx, sy);

        if (recursive) {
          let uid = 0;
          let usx = sx;
          let usy = sy;
          let d = Math.min(sx, sy);
          while (usx > 2 && usy > 2) {
            x += d / 8;
            y += d / 8;
            usx -= d / 4;
            usy -= d / 4;
            g.fillStyle = ++uid % 2 ? c1 : c2;
            g.ctx.fillRect(x, y, usx, usy);
          }
        }
      }
    }
  }

  triangles(col, row) {
    let g = this.g;
    g.fillStyle = this.nextColour();
    g.ctx.fillRect(0, 0, this.w, this.h);
    g.fillStyle = this.nextColour();

    let sx = ~~(this.w / col);
    let sy = ~~(this.h / row);
    let mirror = col * 2 == row;
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        let x0 = i * sx;
        let x1 = x0 + sx;
        let x2 = x0 + sx * 0.5;
        let y0 = j * sy;
        let y1 = y0 + sy;
        if (j % 2 == 0 && mirror) {
          let t = y0;
          y0 = y1;
          y1 = t;
        }
        g.ctx.beginPath();
        g.ctx.moveTo(x0, y0);
        g.ctx.lineTo(x1, y0);
        g.ctx.lineTo(x2, y1);
        g.ctx.closePath();
        g.ctx.fill();
      }
    }
  }

  quarter(id = 0, count = -1, alpha = false) {
    let g = this.g;
    g.fillStyle = this.nextColour();
    g.ctx.fillRect(0, 0, this.w, this.h);
    if (alpha) g.clear();
    let s = Math.max(this.w, this.h);
    let r = id % 2 == 1 ? s / 2 : s;
    g.fillStyle = this.nextColour();
    g.disc(this.anchors[id % this.anchors.length], r);
    if (count != -1) {
      while (r > 2) {
        g.fillStyle = this.nextColour();
        g.disc(this.anchors[id % this.anchors.length], r);
        r -= s / count;
      }
    }
  }

  corner(id = 0) {
    id %= 4;
    id *= 2;

    let g = this.g;
    g.clear();
    let r = Math.max(this.w, this.h) / 2;

    g.fillStyle = this.nextColour();
    g.disc(this.w / 2, this.h / 2, r);
    let poly = [];
    for (let i = id + 1; i < id + this.anchors.length; i++) {
      poly.push(this.anchors[i % this.anchors.length]);
    }
    g.polygon(poly, true);
  }

  star() {
    let g = this.g;
    g.fillStyle = this.nextColour();
    g.ctx.fillRect(0, 0, this.w, this.h);
    let r = Math.max(this.w, this.h) / 2;
    g.fillStyle = this.nextColour();
    this.anchors.forEach((p) => g.disc(p, r));
  }

  almond(dir = 0, alpha = false) {
    let g = this.g;
    if (alpha == false) {
      g.fillStyle = this.nextColour();
      g.ctx.fillRect(0, 0, this.w, this.h);
    }
    g.ctx.save();
    let r = Math.max(this.w, this.h);
    let p0 = this.tl;
    let p1 = this.br;
    if (dir == 1) {
      p0 = this.tr;
      p1 = this.bl;
    }
    g.ctx.beginPath();
    g.ctx.arc(p0.x, p0.y, r, 0, Math.PI * 2, true);
    g.ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2, true);
    g.ctx.rect(0, 0, this.w, this.h);
    g.ctx.clip();
    g.fillStyle = this.nextColour();
    g.ctx.fillRect(0, 0, this.w, this.h);

    g.ctx.restore();
  }

  truchet(dir = 0, alpha = false) {
    let g = this.g;
    g.clear();
    g.ctx.save();

    let p0 = this.tl;
    let p1 = this.br;
    if (dir == 1) {
      p0 = this.tr;
      p1 = this.bl;
    }
    let r = Math.max(this.w, this.h) / 2;
    g.strokeStyle = this.nextColour();
    g.lineWidth = r / 4;
    g.circle(p0, r);
    g.circle(p1, r);
  }

  rose(count = 5) {
    let c = this.ctx;
    let g = this.g;

    let step = (Math.PI * 2) / count;
    let r = Math.max(this.w, this.h) / 2;
    let ce = new Vector2(this.w / 2, this.h / 2);
    c.rect(0, 0, this.w, this.h);

    for (let i = 0; i < count; i++) {
      c.save();
      let p = new Vector2(
        ce.x + Math.cos((i - 1) * step) * r,
        ce.y + Math.sin((i - 1) * step) * r
      );
      c.arc(p.x, p.y, r, 0, Math.PI * 2, true);
      p = new Vector2(
        ce.x + Math.cos((i + 1) * step) * r,
        ce.y + Math.sin((i + 1) * step) * r
      );
      c.arc(p.x, p.y, r, 0, Math.PI * 2, true);
      c.rect(0, 0, this.w, this.h);
      c.clip();

      let angle = i * step;
      p = new Vector2(ce.x + Math.cos(angle) * r, ce.y + Math.sin(angle) * r);
      g.fillStyle = this.nextColour();
      g.disc(p, r);

      c.restore();
    }
  }

  nextColour() {
    this.palette.push(this.palette.shift());
    return this.palette[0];
  }
}

/**
 * rotates a canvas around a lattice by a given amount in radians
 * @param ctx the context to draw to
 * @param lattice the point arounbd which we want to rotate P
 * @param angle the amount of rotation in radians
 * @param drawMethod custom draw method
 */
export function rotation(ctx, lattice, angle, drawMethod) {
  ctx.save();
  // centers ctx matrix on lattice
  ctx.translate(lattice.x, lattice.y);
  // rotates matrix by given angle
  ctx.rotate(angle);
  // moves matrix back to original position
  ctx.translate(-lattice.x, -lattice.y);
  drawMethod(ctx);
  ctx.restore();
}

/**
 *
 * @param ctx context to draw to
 * @param p0 start of the pivot axis
 * @param p1 end of the pivot axis
 * @param drawMethod custom method to call
 * @param offset "glide" distance
 */
export function reflection(ctx, p0, p1, drawMethod, offset = 0) {
  ctx.save();
  //computes line's angle
  var angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  // centers ctx matrix on P0
  ctx.translate(p0.x, p0.y);
  // rotates matrix by p0-p1 angle
  ctx.rotate(angle);
  //mirror
  ctx.scale(1, -1);
  //glide if offset is specified
  ctx.translate(offset, 0);
  // moves matrix back to original position & rotation
  ctx.rotate(-angle);
  ctx.translate(-p0.x, -p0.y);
  drawMethod(ctx);
  ctx.restore();
}
