import "./css/main.css";

import Animation from "./js/day4/Animation";
let anim = new Animation();
anim.start();

window.addEventListener("pointerdown", () => {
  anim.reveal();
});
