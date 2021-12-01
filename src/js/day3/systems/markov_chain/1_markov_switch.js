function Agent(x, y, anchors) {
  this.anchors = anchors;
  this.moving = false;
  this.origin = anchors[~~(Math.random() * anchors.length)];
  this.x = this.origin.x;
  this.y = this.origin.y;
  this.target = null;
  this.trail = [this.origin];
  this.history = [];
  this.markov();
}

//markov function: a une chance de s'exécuter, sinon se rappelle après un certain temps
Agent.prototype.markov = function (r = 0.2, delay = 1) {
  //   console.log("Markov?", r, delay);
  if (this.moving == false && Math.random() < r) {
    // console.log("Markov!");
    return this.move();
  }
  setTimeout(() => {
    this.markov(...arguments);
  }, delay * 1000);
};

//fonction de rappel
Agent.prototype.move = function () {
  this.moving = true;

  this.target = anchors[~~(Math.random() * anchors.length)];
  while (this.origin == this.target)
    this.target = anchors[~~(Math.random() * anchors.length)];

  this.trail.push(this.target);
  if (this.trail.length > 5) this.trail.shift();
  this.loop = setInterval(() => {
    this.x += (this.target.x - this.x) * 0.1;
    this.y += (this.target.y - this.y) * 0.1;
    if (distance(this, this.target) < 5) {
      this.origin = this.target;
      this.x = this.target.x;
      this.y = this.target.y;
      clearInterval(this.loop);
      this.moving = false;
      this.markov();
    }
  }, 16);
};

//fonction de dessin
Agent.prototype.render = function (ctx) {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = this.moving ? "#F00" : "#00f";
  ctx.strokeStyle = this.moving ? "#F00" : "#00f";

  //idle animation
  if (this.moving == false) {
    let t = (performance.now() + this.x) * 0.01;
    this.x = this.origin.x + Math.cos(t) * 50 * Math.sin(t * 0.05);
    this.y = this.origin.y + Math.sin(t) * 50 * Math.sin(t * 0.05);
    ctx.strokeStyle = "#f00";
    line(this, this.origin);
  } else {
    ctx.strokeStyle = "#f00";
    line(this, this.target);
  }

  dot(this.x, this.y, 2);

  this.history.push([this.x, this.y]);
  if (this.history.length > 100) this.history.shift();
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  this.history.forEach((p) => {
    ctx.lineTo(p[0], p[1]);
  });
  ctx.stroke();
  ctx.globalAlpha = 1;
};

function reset(w, h) {
  let nodesCount = 30;
  for (let i = 0; i < nodesCount; i++) {
    anchors.push({
      x: w / 2 + ((Math.random() - 0.5) * w) / 2,
      y: h / 2 + ((Math.random() - 0.5) * h) / 2,
    });
  }
  for (let i = 0; i < nodesCount / 2; i++) {
    agents.push(new Agent(w / 2, h / 2, anchors));
  }
}

function update() {
  requestAnimationFrame(update);

  let center = { x: w / 2, y: h / 2 };
  anchors.forEach((p, i) => {
    let a = angle(center, p);
    let r = distance(center, p);
    p.x = center.x + Math.cos(a + 0.001) * r;
    p.y = center.y + Math.sin(a + 0.001) * r;
  });

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#777";
  anchors.forEach((a) => dot(a.x, a.y, 2));
  agents.forEach((a) => a.render(ctx));
}

//creates a 2D context
var canvas, w, h, ctx;
const agents = [];
const anchors = [];
window.onload = function () {
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  reset(w, h);
  update();
};

function dot(x, y, r = 5) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function line(a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function angle(p0, p1) {
  return Math.atan2(p1.y - p0.y, p1.x - p0.x);
}
function distance(p0, p1) {
  return Math.sqrt(squareDistance(p0.x, p0.y, p1.x, p1.y));
}
function squareDistance(x0, y0, x1, y1) {
  return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
}
