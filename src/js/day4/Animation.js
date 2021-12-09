import Bird3D from "./bird/Bird3D";
import Stage from "./scene/Stage";
import Animator from "./utils/Animator";
let stage, bird, animal;
export default class Animation {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    stage = new Stage(w, h);
    document.body.appendChild(stage.domElement);

    bird = new Bird3D(stage);
    animal = new Bird3D(stage);
    bird.visible = true;
    animal.visible = true;

    Animator.saveValues(bird);
    Animator.close(bird, null, 0);

    Animator.saveValues(animal);
    Animator.close(animal, null, 0);
  }

  resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    stage.resize(w, h);
  }

  start() {
    this.update();
  }

  reveal() {
    if (bird.visible == true) {
      Animator.fold(bird, () => {
        bird.visible = false;
        bird.reset();
        Animator.init(bird);
        animal.visible = true;

        Animator.open(animal, () => {
          console.log("done");
        });
      });
    } else {
      Animator.boom(animal, () => {
        animal.visible = false;
        animal.reset();
        Animator.init(animal);
        bird.visible = true;
        Animator.open(bird, () => {
          console.log("done");
        });
      });
    }
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  update() {
    this.raf = requestAnimationFrame(this.update.bind(this));
    if (bird) bird.update();
    if (animal) animal.update();
    stage.render();
  }
}
