import { Vector2 } from "../geom/Vector";

/**
 * usage :
 let G = new Graphics( ctx );
 G.line( p0, p1 )
 G.circle( x, y, radius )
 etc.
 * @param ctx canvas 2d context
 * @returns {{}} wraps some methods
 * @constructor
 */
function fromAngleRadius(angle, radius) {
  return new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

export default class Graphics {
  static getContext(w, h, parent = null) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    if (parent != null) parent.appendChild(canvas);
    return canvas.getContext("2d");
  }
  constructor(ctx = null) {
    if (ctx == null) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx = Graphics.getContext(w, h, document.body);
    }
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    ctx.g = this;
  }

  set opacity(value) {
    this.ctx.globalAlpha = value;
  }
  set lineWidth(size) {
    this.ctx.lineWidth = size;
  }
  set fillStyle(style) {
    this.ctx.fillStyle = style;
  }
  set strokeStyle(style) {
    this.ctx.strokeStyle = style;
  }
  set lineJoin(style) {
    this.ctx.lineJoin = style;
  }
  set lineCap(style) {
    this.ctx.lineCap = style;
  }
  set lineMitter(style) {
    this.ctx.lineMitter = style;
  }
  setSize(w, h) {
    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // drawing methods

  rect(x, y, w, h, CW = true) {
    w = w || this.canvas.width;
    h = h || this.canvas.height;
    if (CW) {
      this.ctx.fillRect(x, y, w, h);
    } else {
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + h);
      this.ctx.lineTo(x + w, y + h);
      this.ctx.lineTo(x + w, y);
      this.ctx.lineTo(x, y);
      this.ctx.fill();
    }
  }

  line(x0, y0, x1, y1) {
    //permet de passer 2 Vector2s au lieu des coordonnées X0, Y0, X1, Y1
    if (isNaN(x0) && isNaN(y0)) {
      return this.line(x0.x, x0.y, y0.x, y0.y);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }

  quadCurve(a, b, c) {
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
    this.ctx.stroke();
  }

  bezierCurve(a, b, c, d) {
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
    this.ctx.stroke();
  }

  text(text, size, x = 0, y = 0, fontName = "Verdana") {
    this.ctx.font = size + "pt " + fontName;
    this.ctx.fillText(text, x, y);
  }

  polyline(Vector2s, closed) {
    let ctx = this.ctx;
    ctx.beginPath();
    Vector2s.forEach(function (p) {
      ctx.lineTo(p.x, p.y);
    });
    if (Boolean(closed)) ctx.closePath();
    ctx.stroke();
  }

  polygon(Vector2s, closed) {
    let ctx = this.ctx;
    ctx.beginPath();
    Vector2s.forEach(function (p) {
      ctx.lineTo(p.x, p.y);
    });
    if (Boolean(closed) == true) ctx.closePath();
    ctx.fill();
  }

  arc(x, y, radius, angle, length) {
    //permet de passer un Vector2 et un rayon au lieu de X, Y et Rayon
    if (x.x != null) return this.arc(x.x, x.y, y, radius, angle);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, angle, length, length < 0);
    this.ctx.stroke();
  }

  sector(x, y, radius, angle, length) {
    //permet de passer un Vector2 et un rayon au lieu de X, Y et Rayon
    if (x.x != null) return this.sector(x.x, x.y, y, radius, angle);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, radius, angle, length, length < 0);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  sectorFilled(x, y, radius, angle = 0, length = Math.PI) {
    //permet de passer un Vector2 et un rayon au lieu de X, Y et Rayon
    if (x.x != null) return this.sectorFilled(x.x, x.y, y, radius, angle);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, radius, angle, length, length < 0);
    this.ctx.closePath();
    this.ctx.fill();
  }
  circle(x, y, radius) {
    //permet de passer un Vector2 et un rayon au lieu de X, Y et Rayon
    if (x.x != null) return this.circle(x.x, x.y, x.radius || y);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  disc(x, y, radius) {
    //permet de passer un Vector2 et un rayon
    if (x.x != null) return this.disc(x.x, x.y, y);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dots(points, radius) {
    let r = this.ctx.lineWidth;
    let c = this.ctx.lineCap;
    this.ctx.lineWidth = radius;
    this.lineCap = "round";
    this.ctx.beginPath();
    points.forEach((p) => {
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + 0.1, p.y);
    });
    this.ctx.stroke();
    this.lineWidth = r;
    this.lineCap = c;
  }

  strokeRing(x, y, radiusIn, radiusOut, angle, length) {
    //permet de passer un Vector2 au lieu de x, y
    if (x.x != null)
      return this.strokeRing(x.x, x.y, y, radiusIn, radiusOut, angle);

    angle = angle || 0;
    length = length || Math.PI * 2;

    let ia = Math.min(angle, length);
    let oa = Math.max(angle, length);

    let center = new Vector2(x, y);
    let i0 = fromAngleRadius(ia, radiusIn).add(center);
    let o1 = fromAngleRadius(oa, radiusOut).add(center);

    this.ctx.beginPath();
    this.ctx.arc(x, y, radiusIn, ia, oa, false);
    this.ctx.lineTo(o1.x, o1.y);
    this.ctx.arc(x, y, radiusOut, oa, ia, true);
    this.ctx.lineTo(i0.x, i0.y);
    this.ctx.stroke();
  }

  fillRing(x, y, radiusIn, radiusOut, angle, length) {
    //permet de passer un Vector2 au lieu de x, y
    if (x.x != null)
      return this.fillRing(x.x, x.y, y, radiusIn, radiusOut, angle);

    angle = angle || 0;
    length = length || Math.PI * 2;

    let ia = Math.min(angle, length);
    let oa = Math.max(angle, length);

    let center = new Vector2(x, y);
    let i0 = fromAngleRadius(ia, radiusIn).add(center);
    let o1 = fromAngleRadius(oa, radiusOut).add(center);

    this.ctx.beginPath();
    this.ctx.arc(x, y, radiusIn, ia, oa, false);
    this.ctx.lineTo(o1.x, o1.y);
    this.ctx.arc(x, y, radiusOut, oa, ia, true);
    this.ctx.lineTo(i0.x, i0.y);
    this.ctx.fill();
  }

  notches(x0, y0, x1, y1, count, width) {
    //permet de passer un Vector2 au lieu de x, y
    if (x0.x != null && y0.x != null)
      return this.notches(x0.x, x0.y, y0.x, y0.y, x1, y1);

    this.line(x0, y0, x1, y1);
    let p = new Vector2();
    let n = new Vector2(-(y1 - y0), x1 - x0);
    n.normalize(width || 5);

    for (let i = 0; i <= count; i++) {
      let t = i / count;
      p.x = lerp(t, x0, x1);
      p.y = lerp(t, y0, y1);
      this.line(p, Vector2.add(p, n));
    }
  }

  //method to draw an arrow from p0 to p1
  direction(p0, p1, size) {
    let dx = p1.x - p0.x;
    let dy = p1.y - p0.y;
    let a = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(
      p0.x + Math.cos(a + Math.PI / 2) * size,
      p0.y + Math.sin(a + Math.PI / 2) * size
    );
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.lineTo(
      p0.x + Math.cos(a - Math.PI / 2) * size,
      p0.y + Math.sin(a - Math.PI / 2) * size
    );
    this.ctx.fill();
  }

  // image utils
  drawImage(img, x = 0, y = 0, w = -1, h = -1) {
    if (w == -1) {
      this.ctx.drawImage(img, x, y);
    } else {
      let iw = img.width;
      let ih = img.height;
      let r = iw / ih;
      if (h == -1) {
        h = ~~(w * r);
      }
      this.ctx.drawImage(img, 0, 0, iw, ih, x, y, w, h);
    }
  }

  getPixels(x = 0, y = 0, w = -1, h = -1) {
    w = w == -1 ? this.ctx.canvas.width : w;
    h = h == -1 ? this.ctx.canvas.height : h;
    this.imageData = this.ctx.getImageData(x, y, w, h);
    return this.imageData;
  }

  rgb(x, y) {
    if (this.imageData == undefined) this.getPixels();
    let id = ~~(~~x + this.imageData.width * ~~y) * 4;
    let d = this.imageData.data;
    let r = d[id];
    let g = d[id + 1];
    let b = d[id + 2];
    return [r, g, b];
  }

  rgba(x, y) {
    if (this.imageData == undefined) this.getPixels();
    let id = ~~(~~x + this.imageData.width * ~~y) * 4;
    let d = this.imageData.data;
    let r = d[id];
    let g = d[id + 1];
    let b = d[id + 2];
    let a = d[id + 3];
    return [r, g, b, a];
  }

  luma(x, y) {
    let rgb = this.rgb(x, y);
    let r = (rgb[0] / 0xff) * 0.299;
    let g = (rgb[1] / 0xff) * 0.587;
    let b = (rgb[2] / 0xff) * 0.114;
    return r * r + g * g + b * b;
  }
}
