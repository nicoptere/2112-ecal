//markov function: a une chance de s'exécuter, sinon se rappelle après un certain temps
function markov(r = 0.2, delay = 0.05) {
  //dessine un point gris
  let x = w / 2 + Math.cos(angle) * radius;
  let y = h / 2 + Math.sin(angle) * radius;
  ctx.fillStyle = "#DDD";
  dot(x, y, 6);

  //vérifie une condition
  if (Math.random() < r) {
    console.log("Markov!");

    //dessine un point rouge si la condition est remplie
    ctx.fillStyle = "#F00";
    x = w / 2 + Math.cos(angle) * radius;
    y = h / 2 + Math.sin(angle) * radius;
    dot(x, y, 4);
  }

  //rappelle cette fontion plus tard...
  setTimeout(() => {
    this.markov(...arguments);
  }, delay * 1000);

  //fait boucler le rendu
  angle += step;
  radius += 1;
  if (radius > Math.min(w, h) / 4) {
    ctx.clearRect(0, 0, w, h);
    radius = 10;
  }
}

//creates a 2D context
var canvas, w, h, ctx;
const agents = [];
const anchors = [];

//variable de rendu
let angle = 0;
let radius = 20;
let step = (Math.PI / 180) * 30;

window.onload = function () {
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  markov();
};

function dot(x, y, r = 5) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
