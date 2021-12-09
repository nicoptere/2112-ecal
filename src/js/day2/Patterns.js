import Graphics from "./Graphics";
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export default class Patterns {
  constructor(palette, w = 128, h = 128) {
    this.w = w;
    this.h = h;
    this.palette = palette;

    this.corners = [
      new Point(0, 0),
      new Point(w, 0),
      new Point(w, h),
      new Point(0, h),
    ];

    this.ctx = Graphics.getContext(w, h, false);
    this.canvas = this.ctx.canvas;
    this.g = new Graphics(this.ctx);
  }

  checker(col = 1, row = 1) {
    const col0 = this.palette.nextColor();
    const col1 = this.palette.nextColor();
    const sx = this.w / col;
    const sy = this.h / row;
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        let color = col0;
        if (i % 2 == j % 2) color = col1;

        if (col == 1 || row == 1) {
          color = this.palette.nextColor();
        }

        this.ctx.fillStyle = color;

        this.ctx.fillRect(i * sx, j * sy, sx, sy);
      }
    }
  }

  triangles(col = 1, row = 1) {
    this.ctx.fillStyle = this.palette.nextColor();
    this.ctx.fillRect(0, 0, this.w, this.h);

    this.ctx.fillStyle = this.palette.nextColor();

    const sx = this.w / col;
    const sy = this.h / row;
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        let a = new Point(i * sx, j * sy);
        let b = new Point(a.x + sx, a.y);
        let c = new Point(a.x + sx / 2, a.y + sy);
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.lineTo(c.x, c.y);
        this.ctx.lineTo(a.x, a.y);
        this.ctx.fill();
      }
    }
  }

  quarter(corner = 0, count = 1, alpha = false) {
    if (alpha === false) {
      this.ctx.fillStyle = this.palette.nextColor();
      this.ctx.fillRect(0, 0, this.w, this.h);
    }

    let p = this.corners[corner % this.corners.length];
    let r = this.w;
    let sr = r / count;
    for (let i = 0; i < count; i++) {
      this.ctx.fillStyle = this.palette.nextColor();
      this.g.disc(p, r);
      r -= sr;
    }
  }

  mask(corner, drawingFunction, x, y) {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.save();

    let p = this.corners[corner % this.corners.length];

    this.g.disc(p, this.w);
    this.ctx.clip();

    drawingFunction(x, y);

    this.ctx.restore();
  }

  head() {
    this.ctx.save();

    let p = new Point(this.w / 2, this.h);

    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.arc(p.x, p.y, this.w / 2, 0, Math.PI * 2, true);

    this.ctx.clip();

    let r = this.w / 4;
    this.ctx.fillStyle = this.palette.nextColor();
    this.g.disc(r, r, r);
    this.ctx.fillRect(r, 0, this.w, this.h);
    this.ctx.fillRect(0, r, this.w, this.h);

    this.ctx.restore();

    let eye = new Point(this.w * 0.75, this.h * 0.25);

    this.ctx.fillStyle = this.palette.nextColor();
    r = this.w / 10;
    this.g.disc(eye.x, eye.y, r);

    this.ctx.strokeStyle = "#FFF";
    this.ctx.lineWidth = 6;
    this.g.circle(eye.x, eye.y, r);

    this.ctx.fillStyle = "#000";
    this.g.disc(eye.x, eye.y, r / 2);

    this.ctx.fillStyle = "#FFF";
    this.g.opacity = 0.75;
    this.g.disc(eye.x + r / 3, eye.y - r / 3, r / 3);
  }
}
