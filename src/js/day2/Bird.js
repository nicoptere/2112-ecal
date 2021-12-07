import Graphics from "./Graphics";
import Palette from "./Palette";
import Patterns from "./Patterns";

let G, ctx, size, palette, pattern;
export default class Bird {
  constructor() {
    palette = Palette.fromString("264653-2a9d8f-e9c46a-f4a261-e76f51");
    size = 128;
    pattern = new Patterns(palette, size, size);
    pattern.head();

    G = new Graphics();
    // G.drawImage(pattern.canvas, 100, 200, 512, 512);

    ctx = G.ctx;

    this.render();
  }
  render() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    //
    ctx.filter = "brightness(.9)";
    ctx.fillStyle = palette.nextColor(); //bg color
    ctx.fillRect(0, 0, w, h);
    ctx.filter = "brightness(1)";

    ctx.save();
    ctx.translate(w / 2, h / 2); //recenter

    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = ctx.shadowOffsetY = 10;

    let bw = 512; //branch
    let bh = 20;
    ctx.fillStyle = "#000";
    ctx.fillRect(-bw / 2, size - bh / 2, bw, bh);

    this.body(palette);
    this.head(palette);
    this.tail(palette);

    ctx.restore();
  }

  randomize(pattern) {
    let rand = Math.floor(Math.random() * 3);

    let col = 1 + ~~(Math.random() * 4);
    let row = 1 + ~~(Math.random() * 4);
    if (rand == 0) pattern.checker(col, row);
    if (rand == 1) pattern.triangles(col, row);

    let corner = ~~(Math.random() * 4);
    let count = 1 + ~~(Math.random() * 4);
    if (rand == 2) pattern.quarter(corner, count);

    return rand;
  }

  tail(palette) {
    let h = size * 0.5 + Math.random() * size * 2;

    let pattern = new Patterns(palette, size, h);

    let col = 1 + ~~(Math.random() * 4);
    let row = 1 + ~~(Math.random() * 4);
    if (Math.random() > 0.5) {
      pattern.checker(col, row);
    } else {
      pattern.triangles(col, row);
    }
    G.drawImage(pattern.canvas, 0, size, size, h);

    let end = new Patterns(palette, size, size);
    end.quarter(1, col);
    G.drawImage(end.canvas, 0, size + h, size, size);
  }

  head(palette) {
    let pattern = new Patterns(palette, size, size);
    pattern.head();

    G.drawImage(pattern.canvas, -size, -2 * size, size, size);

    let w = size * Math.random();
    let h = size * 0.25 + Math.random() * size * 0.5;

    ctx.fillStyle = palette.nextColor();
    ctx.fillRect(0, -2 * size, w, h);

    ctx.beginPath();
    ctx.arc(w, -2 * size + h, h, 0, -Math.PI / 2, true);
    ctx.lineTo(w, -2 * size + h);
    ctx.fill();
  }

  body(palette) {
    for (let i = -1; i <= 0; i++) {
      for (let j = -1; j <= 0; j++) {
        let pattern = new Patterns(palette, size, size);

        let rand = this.randomize(pattern);

        let fcName = ["checker", "triangles", "quarter"];

        if ((i == 0) & (j == -1)) {
          let drawingFunction = pattern[fcName[rand]].bind(pattern);
          pattern.mask(3, drawingFunction, 3, 3);
        }

        if ((i == -1) & (j == 0)) {
          let drawingFunction = pattern[fcName[rand]].bind(pattern);
          pattern.mask(1, drawingFunction, 3, 3);
        }

        G.drawImage(pattern.canvas, i * size, j * size, size, size);
      }
    }
  }
}
// */
// import BirdPatterns from "./js/cheatsheet/BirdPatterns";
// new BirdPatterns();
