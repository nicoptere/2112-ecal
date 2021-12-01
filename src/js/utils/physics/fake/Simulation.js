import {
  bounceVector,
  distance,
  lineIntersectLine,
  normal,
  project,
} from "../../geom/geomUtils";
import { Vector2 } from "../../geom/Vector";
import Ball from "./Ball";
import Binning from "./Binning";
import Peg from "./Peg";

let p = new Vector2();
let t = new Vector2();

export default class Simulation {
  /**
   * @param {the shape of the table as a series of Vector2} polygon
   */
  constructor(friction = 0.95, wind = undefined, polygon = undefined) {
    this.pool = [];
    this.pegPool = [];
    this.balls = [];
    this.pegs = [];
    this.springs = [];
    let w = window.innerWidth;
    let h = window.innerHeight;
    let screen = [
      new Vector2(0, 0),
      new Vector2(w, 0),
      new Vector2(w, h),
      new Vector2(0, h),
    ];
    this.polygons = [screen];
    if (polygon !== undefined) {
      this.polygons.push(polygon);
    }
    this.friction = friction;
    this.wind = wind || new Vector2();
    this.bin = new Binning(50);
  }

  addBall(x, y, r, acc = null, friction = 0.99) {
    friction = friction || this.friction;
    let b;
    if (this.pool.length > 0) {
      b = this.pool.shift();
      b.reset(x, y, r, friction);
    } else {
      b = new Ball(x, y, r, friction);
    }
    if (acc != null) b.acc.copy(acc);
    this.balls.push(b);
    return b;
  }

  addPeg(x, y, r, count) {
    let b;
    if (this.pegPool.length > 0) {
      b = this.pegPool.shift();
      b.reset(x, y, r, count);
    } else {
      b = new Peg(x, y, r, count);
    }
    this.pegs.push(b);
    return b;
  }

  removeBall(b) {
    this.balls.splice(this.balls.indexOf(b), 1);
    this.pool.push(b);
  }

  removePeg(b) {
    this.pegs.splice(this.pegs.indexOf(b), 1);
    this.pegPool.push(b);
  }

  resize(w, h) {
    this.bin.resize(w, h);
    //update screen polygon
    this.polygons[0][1].x = w;
    this.polygons[0][2].x = w;
    this.polygons[0][2].y = h;
    this.polygons[0][3].y = h;
  }

  update(ctx) {
    //BALL vs BALL collisions
    let collisionDamping = 0.9;
    this.balls.forEach((b) => {
      //retrieve the ball's adjacencyin the binning system
      // let bin = this.bin.getAdjacency(b.id);
      let bin = this.balls.concat(this.pegs);
      //only this ball in the bin, bail out
      if (bin.length == 1) return;

      // bin = bin.concat(this.pegs);
      // console.log(bin.length);
      let dax = b.x + b.vel.x;
      let day = b.y + b.vel.y;
      let fx = 0;
      let fy = 0;

      bin.forEach((o) => {
        if (o === undefined) return;
        if (o == b) return;
        if (distance(b, o) < b.radius + o.radius) {
          let dx = dax - o.x;
          let dy = day - o.y;

          let dist = Math.sqrt(dx * dx + dy * dy);
          let maxdist = b.radius + o.radius;
          let dmax = maxdist - dist;

          if (dmax > 0) {
            if (b.isPeg) {
              b.count--;
              b.col = "#F00";
            }
            if (o.isPeg) {
              o.count--;
              o.col = "#F00";
            }
            let mag1 = (dmax * collisionDamping) / maxdist;
            fx += dx * mag1;
            fy += dy * mag1;
          }
        }
      });
      b.vel.x += fx;
      b.vel.y += fy;
    });

    //BALL vs WALL collisions
    this.balls.forEach((b) => {
      //doesn't move
      if (b.fixed === false) {
        // get the forward ray
        p.copy(b);
        t.copy(b.vel)
          .normalize(b.radius + b.vel.length)
          .add(p);
        this.hitPolygons(b, p, t);
      }

      //locates the particle in the binning system
      b.col = "#000";
      this.bin.evaluate(b);
    });

    // this.bin.render(ctx);

    this.balls.forEach((b) => {
      if (b.fixed == false) {
        b.acc.add(this.wind);
        b.update();
      }
    });

    let tmp = [];
    this.pegs.forEach((p) => {
      if (p.count > 0) {
        tmp.push(p);
      }
    });
    this.pegs = tmp;
    ctx.restore();
  }
  hitPolygons(b, p, t) {
    //check walls collision and bounce vector
    this.polygons.forEach((polygon) => {
      polygon.forEach((pa, i, arr) => {
        let pb = arr[(i + 1) % arr.length];
        let pp = project(p, pa, pb, true);
        if (distance(pp, p) < b.radius) {
          b.copy(normal(pa, pb).multiplyScalar(b.radius).add(pp));
        }
        let ppt = project(t, pa, pb, true);
        if (distance(ppt, p) < b.radius) {
          b.copy(normal(pa, pb).multiplyScalar(b.radius).add(pp));
        }
        let ip = lineIntersectLine(p, t, pa, pb, true, false);
        if (ip != null) {
          let bv = bounceVector(p, t, pa, pb);
          if (bv != null) {
            let rv = bv[1].sub(bv[0]).normalize(b.vel.length);
            b.vel.copy(rv);
          }
        }
      });
    });
  }
  project(ori, dir) {}

  render(ctx) {
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    this.polygons.forEach((polygon) => {
      ctx.g.polyline(polygon, true);
    });

    this.balls.forEach((b) => {
      b.render(ctx);
    });

    this.pegs.forEach((p) => {
      p.render(ctx);
    });
    ctx.restore();
  }
}
