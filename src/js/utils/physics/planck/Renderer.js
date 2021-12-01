import { Vec2 } from "planck-js";

let world, ctx, canvas, options;
export default class Renderer {
  constructor(_world, _canvas, _options = {}) {
    world = _world;
    canvas = _canvas;
    ctx = canvas.getContext("2d");

    let defaultScale = 16;
    const defaultOptions = {
      scale: defaultScale,
      lineWidth: 1 / defaultScale,
      strokeStyle: {
        dynamic: "black",
        static: "red",
        kinematic: "blue",
      },
    };
    options = Object.assign(defaultOptions, _options);
    if (!options.lineWidth) {
      options.lineWidth = 1 / options.scale;
    }
  }

  renderWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let body = world.getBodyList(); body; body = body.getNext()) {
      for (
        let fixture = body.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {
        if (body.visible === false || fixture.visible === false) {
          continue;
        }

        if (body.isDynamic()) {
          ctx.strokeStyle = options.strokeStyle.dynamic;
        } else if (body.isKinematic()) {
          ctx.strokeStyle = options.strokeStyle.kinematic;
        } else if (body.isStatic()) {
          ctx.strokeStyle = options.strokeStyle.static;
        }

        const type = fixture.getType();
        const shape = fixture.getShape();

        ctx.save();
        let sx = options.scale;
        let sy = options.scale;
        let p = body.getPosition();
        const angle = body.getAngle();
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        ctx.setTransform(
          cos * sx,
          -sin * sx,
          sin * sy,
          cos * sy,
          p.x * sx,
          p.y * sy
        );

        ctx.lineWidth = options.lineWidth;
        switch (type) {
          case "circle":
            this.drawCircle(fixture, shape);
            break;
          case "edge":
            this.drawEdge(fixture, shape);
            break;
          case "polygon":
          case "chain":
            this.drawPolygon(fixture, shape);
            break;
        }
        ctx.restore();
      }
    }

    for (let joint = world.getJointList(); joint; joint = joint.getNext()) {
      ctx.save();
      ctx.scale(options.scale, options.scale);
      this.drawJoint(joint);
      ctx.restore();
    }
  }

  drawCircle(fixture, shape) {
    const radius = shape.m_radius;

    if (fixture.sprite !== undefined) {
      ctx.drawImage(
        fixture.sprite,
        0,
        0,
        fixture.sprite.width,
        fixture.sprite.height,
        -radius,
        -radius,
        2 * radius,
        2 * radius
      );
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineTo(0, 0);
    ctx.stroke();
  }

  drawEdge(fixture, shape) {
    let v1 = shape.m_vertex1;
    let v2 = shape.m_vertex2;

    // ctx.beginPath();
    // ctx.moveTo(v1.x, v1.y);
    // ctx.lineTo(v2.x, v2.y);
    // ctx.stroke();

    if (fixture.sprite !== undefined) {
      let pSize = 32;
      if (fixture.pattern === undefined) {
        const patternCanvas = document.createElement("canvas");
        const patternContext = patternCanvas.getContext("2d");
        patternCanvas.width = pSize;
        patternCanvas.height = pSize;
        patternContext.drawImage(
          fixture.sprite,
          0,
          0,
          fixture.sprite.width,
          fixture.sprite.height,
          0,
          0,
          pSize,
          pSize
        );
        let pat = ctx.createPattern(patternCanvas, "repeat");
        fixture.pattern = pat;
      }

      ctx.restore(); // cancel body transform

      ctx.save();
      let s = options.scale;
      let body = fixture.getBody();
      let p = body.getPosition();

      ctx.translate(p.x, p.y);
      ctx.rotate(body.getAngle());

      ctx.lineJoin = "round";
      ctx.lineWidth = pSize;
      ctx.strokeStyle = fixture.pattern;

      let n = new Vec2(-(v2.y - v1.y), v2.x - v1.x);
      n.normalize();
      n.mul(pSize / 2 / options.scale);
      let a = Vec2.add(v1, n);
      a = Vec2.add(a, p);

      let b = Vec2.add(v2, n);
      b = Vec2.add(b, p);

      ctx.beginPath();
      ctx.moveTo(a.x * s, a.y * s);
      ctx.lineTo(b.x * s, b.y * s);
      ctx.stroke();

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x * s, a.y * s);
      ctx.lineTo(b.x * s, b.y * s);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawPolygon(fixture, shape) {
    const lw = options.lineWidth;

    const vertices = shape.m_vertices;
    if (!vertices.length) {
      return;
    }

    //try to determine if it's a box and draw a sprite
    if (fixture.sprite !== undefined) {
      if (vertices.length === 4) {
        if (
          vertices[0].x === -vertices[2].x &&
          vertices[0].y === -vertices[2].y
        ) {
          let w = vertices[0].x;
          let h = vertices[0].y;
          ctx.drawImage(
            fixture.sprite,
            0,
            0,
            fixture.sprite.width,
            fixture.sprite.height,
            -w,
            -h,
            w * 2,
            h * 2
          );
          ctx.strokeRect(-w, -h, w * 2, h * 2);
        }
      }
      return;
    }

    ctx.beginPath();
    for (let i = 0; i < vertices.length; ++i) {
      const v = vertices[i];
      const x = v.x - lw;
      const y = v.y - lw;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    if (vertices.length > 2) {
      ctx.closePath();
    }
    ctx.stroke();
  }

  drawJoint(joint) {
    const a = joint.getAnchorA();
    const b = joint.getAnchorB();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}
