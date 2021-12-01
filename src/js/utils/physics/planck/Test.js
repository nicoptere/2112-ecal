import Runner from "./Runner";
import Renderer from "./Renderer";
import { World, Edge, Vec2, Circle, Polygon, Chain, Box } from "planck-js";
import { BoxShape } from "planck-js/lib/shape/BoxShape";
import { clamp, lerp } from "../../geom/geomUtils";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let world, renderer, a, b, c, l, r;
export default class Test {
  constructor() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    document.body.appendChild(canvas);

    world = World(new Vec2(0, 9.82));

    renderer = new Renderer(world, canvas);

    // init world entities
    let s = 0.0625;

    l = world
      .createKinematicBody()
      .createFixture(Edge(Vec2(0, 0), Vec2((w / 2) * s, h * s)));

    r = world
      .createKinematicBody()
      .createFixture(Edge(Vec2(w * s, 0), Vec2((w / 2) * s, h * s)));
    a = world
      .createKinematicBody()
      .createFixture(Edge(Vec2(-100 * s, 0), Vec2(100 * s, 0)));

    console.log(a);
    console.log(world);

    // a.getBody().setPosition(new Vec2(10, -10));
    b = world
      .createDynamicBody(Vec2((w / 2) * s, 3.5))
      .createFixture(Circle(0.5), {
        density: 1100,
        restitution: 0.1,
        friction: 0.9,
      });

    for (let i = 0; i < 100; i++) {
      let r = 0.5 + Math.random();
      world
        .createDynamicBody(
          Vec2(
            (w / 2 + (Math.random() - 0.5) * 200) * s,
            3.5 - +(Math.random() - 0.5) * 2
          )
        )
        .createFixture(Circle(r), {
          density: 10 + r * 10,
          restitution: 0.1,
          friction: 0.5,
        });
    }

    world
      .createDynamicBody(Vec2((w / 2) * s, 10.0))
      .createFixture(Circle(5.0), {
        density: 10,
        restitution: 0.999,
        friction: 0.1,
      });

    c = world
      .createBody(Vec2((w / 2 + 10) * s, 25.5))
      .createFixture(Box(4, 4), 0);
    // console.log(c);
    // console.log(c.m_shape);

    let ss = 3;
    var loop = world.createBody(Vec2((w / 2 - 250) * s, (h / 2 + 150) * s));
    loop.createFixture(
      Chain(
        [
          Vec2(ss * 0.0, 0.0 * ss),
          Vec2(ss * 6.0, 0.0 * ss),
          Vec2(ss * 6.0, 2.0 * ss),
          Vec2(ss * 4.0, 1.0 * ss),
          Vec2(ss * 2.0, 2.0 * ss),
          Vec2(ss * 0.0, 2.0 * ss),
          Vec2(ss * -2.0, 2.0 * ss),
          Vec2(ss * -4.0, 3.0 * ss),
          Vec2(ss * -6.0, 2.0 * ss),
          Vec2(ss * -6.0, 0.0 * ss),
        ],
        true
      ),
      0.0
    );
    loop.setAngle(Math.PI);

    // Remove fixture from UI if required
    world.on("remove-fixture", function (fixture) {
      console.log("dispose fixture", fixture);
    });
    world.on("remove-body", function (body) {
      console.log("dispose body", body);
    });
    let bo = b.getBody();
    let f = bo.getFixtureList();
    // console.log(bo);
    // console.log(f);

    // bo.destroyFixture(f);
    // world.destroyBody(bo);

    // let y = 630 / 16;
    // // let y = (630 + Math.sin(performance.now() * 0.001) * 60) / 16;
    // a.getBody().setPosition(new Vec2(0, -2));
    // a.getBody().setLinearVelocity(new Vec2(0, -5));

    // Start game loop
    this.current_time = performance.now();
    this.last_time = performance.now();
    this.fps = 30;
    this.speed = 1;
    let img = new Image();
    img.src = "assets/sprites/animals/svg/6.svg";
    img.onload = () => {
      a.sprite = img;
      b.sprite = img;
      c.sprite = img;
      l.sprite = img;
      r.sprite = img;
      this.loop();
    };
  }
  // Game loop
  loop() {
    this.current_time = performance.now();
    let delta_time = (this.current_time - this.last_time) * 0.001;
    let step = 1 / this.fps;
    world.step(step);
    // while (delta_time >= 0) {
    //   delta_time -= step;
    // }
    this.last_time = this.current_time;

    renderer.renderWorld();
    a.getBody().setAngle(performance.now() * 0.002);

    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    // Iterate over bodies and fixtures
    for (var body = world.getBodyList(); body; body = body.getNext()) {
      for (
        var fixture = body.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {
        // Draw or update fixture
      }
    }
  }
}
