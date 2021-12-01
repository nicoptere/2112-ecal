import clone from "clone";
import Matter from "matter-js";
import Rect from "../../geom/Rect";
import { PRNG } from "../../PRNG";
// module aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Common = Matter.Common;

let engine, render, boxA, path, trail;
export default class Projection {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    path = [];
    trail = [];
    // create an engine
    engine = Engine.create();
    engine.world.gravity.y = 1;

    // create a renderer

    render = Render.create({
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
    let cx = r.x + r.w / 2;
    let cy = r.y + r.h / 2;
    boxA = Bodies.circle(cx, h - 150, 40);
    //, {
    //   collisionFilter: {
    //     group: -1,
    //     category: 4,
    //     mask: 2,
    //   },
    // });
    // , {
    //   collisionFilter: {
    //     group: -1,
    //     category: 2,
    //     mask: 4,
    //   },
    // });

    // create two boxes and a ground
    let s = 500;
    var bottom = Bodies.rectangle(cx, h + s / 2, w * 2, s, { isStatic: true });
    var top = Bodies.rectangle(cx, -s / 2, w * 2, s, { isStatic: true });
    var left = Bodies.rectangle(-s / 2, cy, s, h * 2, { isStatic: true });
    var right = Bodies.rectangle(w + s / 2, cy, s, h * 2, { isStatic: true });

    var stack = Composites.stack(100, 50, 3, 6, 5, 5, function (x, y) {
      return Bodies.circle(x, y, Common.random(15, 30), {
        restitution: 0.1,
        friction: 0.9,
        isStatic: true,
      });
    });

    stack.bodies.forEach((b) => {
      b.position.x += (PRNG.random() - 0.5) * 50;
      b.position.y += (PRNG.random() - 0.5) * 50;
    });

    // add all of the bodies to the world
    Composite.add(engine.world, [stack, boxA, bottom, right, left, top]);

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

    setTimeout(() => {}, 1000);
    this.update();

    render.canvas.addEventListener("pointerdown", () => {
      boxA.force.x = -0.1;
      boxA.force.y = -1;
      boxA = this.project(boxA);
    });
    // setTimeout(() => {
    //   Composite.remove(engine.world, boxA);
    //   let boxB = Bodies.rectangle(cx, h - 150, 80, 80);
    //   boxB.force.x = -0.1;
    //   boxB.force.y = -1;
    //   Composite.add(engine.world, boxB);
    //   //   boxB = this.project(boxB);
    // }, 5000);
  }

  //not on Webview
  //   structuralClone(obj) {
  //     return new Notification("", { data: obj, silent: true }).data;
  //   }

  structuralClone(obj) {
    const oldState = history.state;
    history.replaceState(obj, document.title);
    const copy = history.state;
    history.replaceState(oldState, document.title);
    return copy;
  }

  project(body) {
    const copy = this.structuralClone(body); //clone(body, true, 10);
    copy.id = Common.nextId();

    for (let i = 0; i < 150; i++) {
      // Body.update(body, 16.666666666666668, 2, 1); //, 1, 2, 1);
      //   console.log(body.position.x.toFixed(2), body.position.y.toFixed(2));
      path.push([body.position.x, body.position.y]);
      Engine.update(engine);
    }

    Composite.remove(engine.world, body);
    Composite.add(engine.world, copy);
    return copy;
  }

  update() {
    requestAnimationFrame(this.update.bind(this));
    Engine.update(engine);
    let ctx = render.canvas.getContext("2d");

    path.forEach((p) => {
      ctx.fillRect(p[0], p[1], 3, 3);
    });

    trail.push([boxA.position.x, boxA.position.y]);
    if (trail.length > 1000) trail.shift();
    ctx.beginPath();
    trail.forEach((p) => {
      ctx.lineTo(p[0], p[1], 3, 3);
    });
    ctx.stroke();
  }
}
