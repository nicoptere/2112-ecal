import Graphics from "../utils/gfx/Graphics";
import { Palette } from "./Palettes";
import Patterns from "./Patterns";

let g, w, h, size;
let patterns, palette;
export default class Bird {
  constructor() {
    g = new Graphics();

    w = window.innerWidth;
    h = window.innerHeight;

    let str = "9b5de5-f15bb5-fee440-00bbf9-00f5d4";
    str = "335c67-fff3b0-e09f3e-9e2a2b-540b0e";
    // str = "264653-2a9d8f-e9c46a-f4a261-e76f51";
    // str = "f8ffe5-06d6a0-1b9aaa-ef476f-ffc43d";
    // str = "011627-fdfffc-2ec4b6-e71d36-ff9f1c";
    palette = Palette.fromString(str);

    size = 128;
    patterns = new Patterns(size, size, palette.values);

    this.render();
  }

  /**
 * the bird's shape
  ┌────────┬──────────┐────┐
  │        │ beak     |    │
  │  head  ├──────────┘────┘
  │        ├────?─────►
  ├────────┼───────┐
  │        │       │
  │  body  │ body  │
  │        │       │
  ├────────┼───────┤
  │        │       │
  │  body  │ body  │
  │        │       │
  └───────┬┼───────┤
          ││       │
          ││       │
          ││       │
         ?││ tail  │
          ││       │
          ││       │
          ││       │
          ▼├───────┤
           │       │
           │       │
           └───────┘
 */

  randomizePattern(p) {
    let col = 1 + ~~(Math.random() * 3);
    let row = 1 + ~~(Math.random() * 3);
    let r = ~~(Math.random() * 4);
    if (r == 0) p.dots(col, row, Math.random() > 0.5);
    if (r == 1) p.checker(col, row, Math.random() > 0.5);
    if (r == 2) p.triangles(col, row);
    if (r == 3) p.quarter(~~(Math.random() * 8), 3, false);
  }

  render() {
    setTimeout(this.render.bind(this), 2000);

    let ctx = g.ctx;

    let bg = palette.asRGB()[0];
    let b = 1.25;
    g.fillStyle = `rgb( ${bg[0] * b},${bg[1] * b},${bg[2] * b} )`;

    g.rect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    g.fillStyle = "#000";
    g.rect(-size * 2, -15, size * 4, 30);

    //le corps est constitué de 4 motifs côte à côte

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        this.randomizePattern(patterns);

        //les blocs bas gauche et haut droit sont arrondis
        if (i == 1 && j == 0) patterns.quarter(6, 3, true);
        if (i == 0 && j == 1) patterns.quarter(2, 3, true);

        g.drawImage(patterns.canvas, (i - 1) * size, (j - 2) * size);
      }
    }

    // la queue est faite de 2 blocs dont un à une longueur variable
    let tailHeight = (1 + Math.random()) * size;
    //le bloc de hauteur variable
    patterns.triangles(4, 3);
    g.drawImage(patterns.canvas, 0, 0, size, tailHeight);

    patterns.quarter(2, 3, true);
    g.drawImage(patterns.canvas, 0, tailHeight, size, size);

    //la tête est un peu spéciale, on lui fait une fonction custom
    this.head(-size, -3 * size);

    ctx.restore();
  }

  head(x, y) {
    patterns.corner(0);
    g.drawImage(patterns.canvas, x, y);
    patterns.quarter(5, 1, true);
    g.drawImage(patterns.canvas, x, y);

    //l'oeil:
    g.fillStyle = "#FFF";
    g.disc(x + size * 0.75, y + size * 0.25, size / 8);

    g.fillStyle = palette.values[2];
    g.disc(x + size * 0.75, y + size * 0.25, size / 10);

    g.fillStyle = "#222";
    g.disc(x + size * 0.75, y + size * 0.25, size / 16);

    //le bec

    //le bout arrondi
    let beakWidth = size * (Math.random() * 1.5 + 0.25);
    let beakHeight = size * (Math.random() * 0.5 + 0.25);
    patterns.corner(1);
    g.drawImage(
      patterns.canvas,
      x + size + beakWidth - 2,
      y,
      beakHeight,
      beakHeight
    );
    g.strokeStyle = g.fillStyle = patterns.ctx.fillStyle;
    g.rect(x + size - 1, y, beakWidth, beakHeight);
  }
}
