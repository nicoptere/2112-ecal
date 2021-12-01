import Graphics from "../utils/gfx/Graphics";
import { Palette } from "./Palettes";
import Patterns from "./Patterns";

let g, ctx, w, h;
export default class BirdPatterns {
  constructor() {
    w = window.innerWidth;
    h = window.innerHeight;
    g = new Graphics();

    let s = 128;
    let col = w / s;
    let row = h / s;
    let pal, str;

    str = "9b5de5-f15bb5-fee440-00bbf9-00f5d4";
    str = "335c67-fff3b0-e09f3e-9e2a2b-540b0e";
    // str = "264653-2a9d8f-e9c46a-f4a261-e76f51";
    // str = "f8ffe5-06d6a0-1b9aaa-ef476f-ffc43d";
    // str = "011627-fdfffc-2ec4b6-e71d36-ff9f1c";
    pal = Palette.fromString(str);

    let p = new Patterns(s, s, pal.values);
    for (let i = 0; i <= col; i++) {
      for (let j = 0; j <= row; j++) {
        let col = 1 + ~~(Math.random() * 4);
        let row = 1 + ~~(Math.random() * 4);

        // p.truchet(~~(Math.random() * 2));

        let r = ~~(Math.random() * 8);
        if (r == 0) p.dots(col, row, Math.random() > 0.5);
        if (r == 1) p.checker(col, row, Math.random() > 0.5);
        if (r == 2) p.triangles(col, row);
        if (r == 3) p.quarter(~~(Math.random() * 8), 3, false);
        if (r == 4) p.corner(~~(Math.random() * 4));
        if (r == 5) p.star();
        if (r == 6) p.almond(~~(Math.random() * 2));
        if (r == 7) p.rose();

        g.drawImage(p.canvas, i * s, j * s);
      }
    }
  }
}
