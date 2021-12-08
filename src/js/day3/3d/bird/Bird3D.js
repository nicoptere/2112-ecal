import { Object3D } from "three";
import Bird from "../../../day2/Bird";
import Palette from "../../../day2/Palette";
import Patterns from "../../../day2/Patterns";
import Pattern3D from "./Pattern3D";
let palette, pattern, size;

export default class Bird3D extends Object3D {
  constructor(stage) {
    super();
    stage.add(this);

    // let bird2D = new Bird();
    palette = Palette.fromString("264653-2a9d8f-e9c46a-f4a261-e76f51");
    size = 128;
    pattern = new Patterns(palette, size, size);
    pattern.head();

    //coloeur de fond
    stage.setClearColor(palette.nextColor());

    this.patterns = [];

    let scale = 10;
    let p3 = new Pattern3D(pattern, palette, scale);
    this.add(p3);
    this.patterns.push(p3);

    //aller chercher tous les motifs
  }
  reset() {
    //régénérer l'oiseau
    //recréer les patterns 3D
  }
  update() {
    //update something here
    this.patterns.forEach((p) => {
      p.update();
    });
  }
}
