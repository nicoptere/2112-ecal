import Bird3D from "./bird/Bird3D";
import Stage from "./scene/Stage";
let stage, bird;
export default class Animation {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    stage = new Stage(w, h);
    document.body.appendChild(stage.domElement);

    bird = new Bird3D(stage);
  }

  resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    stage.resize(w, h);
  }

  start() {
    this.update();
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  update() {
    this.raf = requestAnimationFrame(this.update.bind(this));
    if (bird) bird.update();
    stage.render();
  }
}
