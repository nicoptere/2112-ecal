import Matter from "matter-js";
import Rect from "../../geom/Rect";
import { PRNG } from "../../PRNG";
// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Vec = Matter.Vector,
  Common = Matter.Common;
// create an engine
var engine = Engine.create();

// create a renderer

let w = window.innerWidth;
let h = window.innerHeight;

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: w,
    height: h,
    pixelRatio: 1,
    background: "#fafafa",
    wireframeBackground: "#222",
    hasBounds: false,
    enabled: true,
    wireframes: false,
    showSleeping: true,
    showDebug: false,
    showBroadphase: false,
    showBounds: false,
    showVelocity: false,
    showCollisions: false,
    showSeparations: false,
    showAxes: false,
    showPositions: false,
    showAngleIndicator: false,
    showIds: false,
    showShadows: false,
    showVertexNumbers: false,
    showConvexHulls: false,
    showInternalEdges: false,
    showMousePosition: false,
  },
});

let r = new Rect(
  w / 2 - h / 3,
  h / 2 - (h / 3) * 1.25,
  (h / 3) * 2,
  (h / 3) * 2.5
);
// create two boxes and a ground
let cx = r.x + r.w / 2;
let cy = r.y + r.h / 2;
var boxA = Bodies.rectangle(cx, 100, 80, 80);
var boxB = Bodies.rectangle(cx + 50, 50, 80, 80);

// body.collisionFilter = {
//   group: -1,
//   category: 2,
//   mask: 0,
// };
// Matter.IBodyDefinition.isSensor;

let size = 500;
var bottom = Bodies.rectangle(cx, h + size / 2, w * 2, size, {
  isStatic: true,
});
var top = Bodies.rectangle(cx, -size / 2, w * 2, size, { isStatic: true });
var left = Bodies.rectangle(-size / 2, cy, size, h * 2, { isStatic: true });
var right = Bodies.rectangle(w + size / 2, cy, size, h * 2, { isStatic: true });

var stack = Composites.stack(100, 50, 3, 6, 5, 5, function (x, y) {
  return Bodies.circle(x, y, Common.random(15, 30), {
    restitution: 0.1,
    friction: 0.9,
  });
});
engine.world.gravity.y = 0;
setInterval(() => {
  stack.bodies.forEach((b) => {
    if (PRNG.random() > 0.75) {
      b.force.x = (PRNG.random() - 0.5) * 0.1;
      b.force.y = (PRNG.random() - 0.5) * 0.1;
    }
  });
}, 1000);

// add all of the bodies to the world
Composite.add(engine.world, [stack, boxA, boxB, bottom, right, left, top]);

// add mouse control
// let mouseConstraint;
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true,
      },
    },
  });
Composite.add(engine.world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;

// run the renderer
Render.run(render);

let pad = Vec.create(25, 50);
function update() {
  requestAnimationFrame(update);
  // Matter.Render.lookAt(render, [boxA, boxB], pad);

  // run the engine
  Engine.update(engine);
}
update();
