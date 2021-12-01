function next() {
  id++;
  id %= 6;
}
function reset() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";

  var i, x, y, r;
  var count = 10000;
  ctx.font = "32px Arial";
  var time = Date.now();
  for (i = 0; i < count; i++) {
    //normalize the i
    var t = i / count;

    //linear X value
    x = t * w;

    //start with a regular sinusoid
    r = Math.sin(t * Math.PI * 2);

    if (id == 1) {
      //now to get a seemingly random value
      //augment the frequency.
      r = Math.sin(t * time);
    }

    if (id == 2) {
      //some nice patterns emerge but they're very regular
      //we can shake it further by using the result as the seed for another sinusoid
      r = Math.sin(Math.sin(t * time) * time);
    }

    if (id == 3) {
      //better already but the values seem to 'stick' to the boundaries
      //we'd rather have uniformly distributed values
      r = Math.abs(Math.sin(Math.sin(t * time) * time));
    }

    if (id >= 4) {
      //better already but the values seem to 'stick' to the boundaries
      r = Math.abs(Math.sin(Math.sin(t * time) * time));
      //we'd rather have uniformly distributed values
      r = Math.sqrt(1 - r) * 2 - 1;
    }
    //plots it nicely centered
    y = h / 2 + (r * h) / 3;
    disc(x, y, 2);
  }

  //start with a regular sinusoid
  r = Math.sin(t * Math.PI * 2);

  if (id == 0) {
    ctx.fillText("Math.sin(t * Math.PI * 2);", 100, 100);
  }

  if (id == 1) {
    ctx.fillText("r = Math.sin(t * time);", 100, 100);
  }

  if (id == 2) {
    ctx.fillText("r = Math.sin(Math.sin(t * time) * time)", 100, 100);
  }

  if (id == 3) {
    ctx.fillText(
      "r = Math.abs(Math.sin(Math.sin(t * time) * time));",
      100,
      100
    );
  }
  if (id >= 4) {
    ctx.fillText(
      `r = Math.abs(Math.sin(Math.sin(t * time) * time));\n
        r = Math.sqrt(1 - r) * 2 - 1;
    `,
      100,
      100
    );
  }

  if (id == 5) {
    //actual results from a Math.random() (ground truth)
    ctx.fillStyle = "#F00";
    for (i = 0; i < count; i++) {
      x = (i / count) * w;
      y = h / 2 + ((Math.random() * 2 - 1) * h) / 3;
      disc(x, y, 2);
    }
  }
}

//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement("canvas");
document.body.appendChild(canvas);
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
ctx = canvas.getContext("2d");
var seed = 0;
var id = 0;
reset();

canvas.addEventListener("mousedown", () => {
  next();
  reset();
});

function disc(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
