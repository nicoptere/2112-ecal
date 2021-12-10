import Bird3D from "./bird/Bird3D";
import Animal3D from "./bird/Animal3D";
import Stage from "./scene/Stage";
import Animator from "./utils/Animator";
let stage, bird, animal;
let locked = false;
export default class Animation {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    stage = new Stage(w, h);
    document.body.appendChild(stage.domElement);

    bird = new Bird3D(stage);
    bird.visible = false;
    animal = new Animal3D(stage);

    Animator.init(bird);
    Animator.init(animal);
    this.reveal();
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
    if (locked === true) {
      console.warn("animation already playing");
      return;
    }
    if (bird.visible == true) {
      //fait disparaitre l'oiseau
      locked = true;
      console.log("hide bird");
      Animator.fold(bird, () => {
        //masque, randomize et réinitialise l'oiseau
        bird.visible = false;
        bird.reset();
        Animator.init(bird);
        animal.visible = true;

        //attend 2 secondes avant de passer à l'animal
        console.log("show animal in 2 seconds");
        setTimeout(() => {
          //affiche l'animal en 3 secondes
          console.log("show animal");
          Animator.open(
            animal,
            () => {
              console.log("display animal");
              locked = false;
            },
            3
          );
        }, 2000); // <= les 2 secondes (en millisecondes)
      });
    } else {
      //fait disparaitre l'animal
      locked = true;
      console.log("hide animal");
      Animator.boom(animal, () => {
        //masque, randomize et réinitialise l'animal
        animal.visible = false;
        animal.reset();
        Animator.init(animal);
        bird.visible = true;

        //attend 2 secondes avant de passer à l'oiseau
        console.log("show bird in 2 seconds");
        setTimeout(() => {
          console.log("show bird");
          //affiche l'oiseau en 3 secondes
          Animator.open(
            bird,
            () => {
              console.log(" display bird");
              locked = false;
            },
            3
          );
        }, 2000); // <= les 2 secondes (en millisecondes)
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
