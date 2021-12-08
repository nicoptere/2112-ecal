import Stage from "./scene/Stage";
import Scene from "./scene/Scene";
let stage, scene;
export default class Animation {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    stage = new Stage(w, h);
    document.body.appendChild(stage.domElement);

    scene = new Scene(stage);
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
    if (scene) scene.update();
    stage.render();
  }
}
