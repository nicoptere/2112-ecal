import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
} from "three";
import Palette from "../../day2/Palette";
import Patterns from "../../day2/Patterns";
import BackgroundColor from "../utils/BackgroundColor";
import Pattern3D from "./Pattern3D";
let palette, pattern, size;

let RAD = Math.PI / 180;
let depth = 0.1;

export default class Bird3D extends Object3D {
  constructor(stage) {
    super();
    stage.add(this);

    palette = Palette.fromString("264653-2a9d8f-e9c46a-f4a261-e76f51");
    size = 128;
    pattern = new Patterns(palette, size, size);

    this.stage = stage;
    this.patterns = [];
    this.reset();
  }

  reset() {
    console.log("reset bird");
    //clear the scene
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
    this.patterns = [];

    //couleur de fond
    BackgroundColor.changeColor(palette.nextColor(), 2);

    //régénérer l'oiseau
    this.body(palette);
    this.head(palette);
    this.tail(palette);
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
    let h = 0.5 + Math.random() * 2;

    let pattern = new Patterns(palette, size, size * h);
    let col = 1 + ~~(Math.random() * 4);
    let row = 1 + ~~(Math.random() * 4);
    if (Math.random() > 0.5) {
      pattern.checker(col, row);
    } else {
      pattern.triangles(col, row);
    }

    let p = new Pattern3D(pattern, palette);
    this.add(p);
    this.patterns.push(p);
    p.scale.y = h;
    p.position.y = -1 - (h - 1) / 2;

    let end = new Patterns(palette, size, size);
    end.quarter(1, col, true);

    p = new Pattern3D(end, palette);
    this.add(p);
    this.patterns.push(p);
    p.remove(p.box);
    p.position.y = -1 - h;
  }

  head(palette) {
    let pattern = new Patterns(palette, size, size);
    pattern.head();

    let p3d = new Pattern3D(pattern, palette);
    this.add(p3d);
    this.patterns.push(p3d);
    p3d.position.x = -1;
    p3d.position.y = 2;

    let w = Math.random();
    let h = 0.25 + Math.random() * 0.5;

    // TODO nester le bec

    let color = palette.nextColor();
    let material = new MeshBasicMaterial({ transparent: true, color: color });
    let box = new BoxBufferGeometry();
    let m = new Mesh(box, material);
    this.add(m);
    m.scale.x = w;
    m.scale.y = h;
    m.scale.z = depth;
    m.position.x = w / 2 - 0.5;
    m.position.y = 2.5 - h / 2;
    m.position.z = -depth / 2;

    let cyl = new CylinderBufferGeometry(
      h,
      h,
      depth,
      32,
      1,
      false,
      0,
      Math.PI / 2
    );
    let b = new Mesh(cyl, material);
    this.add(b);
    b.rotation.x = -Math.PI / 2;
    b.position.x = w - 0.5;
    b.position.y = 2.5 - h;
    b.position.z = -depth / 2;
  }

  body(palette) {
    for (let i = -1; i <= 0; i++) {
      for (let j = -1; j <= 0; j++) {
        let pattern = new Patterns(palette, size, size);
        let rand = this.randomize(pattern);

        let fcName = ["checker", "triangles", "quarter"];
        if (i == 0 && j == -1) {
          let drawingFunction = pattern[fcName[rand]].bind(pattern);
          pattern.mask(3, drawingFunction, 3, 3);
        }

        if (i == -1 && j == 0) {
          let drawingFunction = pattern[fcName[rand]].bind(pattern);
          pattern.mask(1, drawingFunction, 3, 3);
        }

        let p3d = new Pattern3D(pattern, palette);
        p3d.position.x = i;
        p3d.position.y = -j;
        this.add(p3d);

        if ((i == 0 && j == -1) || (i == -1 && j == 0)) {
          p3d.remove(p3d.box);
        }
        this.patterns.push(p3d);
      }
    }
  }

  update() {
    this.patterns.forEach((p) => {
      p.scale.z = depth;
      p.update();
    });
  }
}
