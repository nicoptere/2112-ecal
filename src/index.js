import "./css/main.css";

import Animation from "./js/day5/Animation";
let anim = new Animation();
anim.start();

window.addEventListener("keydown", () => {
  anim.reveal();
});
