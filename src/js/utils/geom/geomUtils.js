import { Vector2 } from "./Vector";

export const ip = new Vector2();
export const PI = Math.PI;
export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

export function smoothstep(a, b, x) {
  return lerp(catmull(x), a, b);
}

export function catmull(t) {
  return t * t * (3 - 2 * t);
}

export function lerp(t, a, b) {
  return a * (1 - t) + b * t;
}

export function norm(t, a, b) {
  return (t - a) / (b - a);
}

export function remap(t, a0, b0, a1, b1) {
  return lerp(norm(t, a0, b0), a1, b1);
}

export function clamp(t, min, max) {
  return Math.min(max, Math.max(min, t));
}

/******************************************************
  * 
  VECTOR UTILITIES
  *
*****************************************************/

export function angle(p0, p1) {
  return Math.atan2(p1.y - p0.y, p1.x - p0.x);
}

export function distance(v1, v2) {
  return Math.sqrt(squareDistance(v1, v2));
}

export function squareDistance(v1, v2) {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  return dx * dx + dy * dy;
}

export function getAngle(p0, p1) {
  return Math.atan2(p1.y - p0.y, p1.x - p0.x);
}

/*
---------------------------------------------------------------
http://keith-hair.net/blog/
Checks for intersection of Segment if as_seg is true.
Checks for intersection of Line if as_seg is false.
Return intersection of Segment AB and Segment EF as a Vector2
Return null if there is no intersection
---------------------------------------------------------------
*/
export function lineIntersectLine(A, B, E, F, ABasSeg, EFasSeg) {
  let a1, a2, b1, b2, c1, c2;
  a1 = B.y - A.y;
  b1 = A.x - B.x;
  a2 = F.y - E.y;
  b2 = E.x - F.x;

  let denom = a1 * b2 - a2 * b1;
  if (denom == 0) return null;

  c1 = B.x * A.y - A.x * B.y;
  c2 = F.x * E.y - E.x * F.y;

  let ip = new Vector2();
  ip.x = (b1 * c2 - b2 * c1) / denom;
  ip.y = (a2 * c1 - a1 * c2) / denom;

  if (A.x == B.x) ip.x = A.x;
  else if (E.x == F.x) ip.x = E.x;
  if (A.y == B.y) ip.y = A.y;
  else if (E.y == F.y) ip.y = E.y;

  //	Constrain to segment.
  if (ABasSeg) {
    if (A.x < B.x ? ip.x < A.x || ip.x > B.x : ip.x > A.x || ip.x < B.x)
      return null;
    if (A.y < B.y ? ip.y < A.y || ip.y > B.y : ip.y > A.y || ip.y < B.y)
      return null;
  }
  if (EFasSeg) {
    if (E.x < F.x ? ip.x < E.x || ip.x > F.x : ip.x > E.x || ip.x < F.x)
      return null;
    if (E.y < F.y ? ip.y < E.y || ip.y > F.y : ip.y > E.y || ip.y < F.y)
      return null;
  }
  return ip;
}

/**
 * projects the Vector2 p on the line A-B
 * @param p
 * @param a
 * @param b
 * @param asSegment if set to true, contrains the intersection to the segment
 * @returns {*}
 */
export function project(p, a, b, asSegment) {
  let A = p.x - a.x;
  let B = p.y - a.y;
  let C = b.x - a.x;
  let D = b.y - a.y;

  let dot = A * C + B * D;
  let len = C * C + D * D;
  let t = dot / len;

  if (asSegment) {
    if (t < 0) return a;
    if (t > 1) return b;
  }
  return new Vector2(a.x + t * C, a.y + t * D);
}

export function bisector(a, b, c) {
  let angle = (getAngle(a, b) + getAngle(a, c)) * 0.5;
  let p = new Vector2(a.x + Math.cos(angle), a.y + Math.sin(angle));
  return lineIntersectLine(a, p, b, c);
}

export function getIncenter(a, b, c) {
  let bis_a = bisector(a, b, c);
  let bis_b = bisector(b, a, c);
  return lineIntersectLine(a, bis_a, b, bis_b);
}

export function determinant(p, a, b) {
  return (a.x - b.x) * (p.y - b.y) - (p.x - b.x) * (a.y - b.y);
}

export function isLeft(p, a, b) {
  return determinant(p, a, b) >= 0;
}

export function isRightt(p, a, b) {
  return determinant(p, a, b) <= 0;
}

export function normalizeVector(p) {
  var l = p.length();
  return new Vector2(p.x / l, p.y / l);
}

export function normal(p0, p1) {
  return new Vector2(-(p1.y - p0.y), p1.x - p0.x).normalize();
}

export function dotProduct(u, v) {
  return u.x * v.x + u.y * v.y;
}

export function crossProduct(u, v) {
  return u.x * v.y - u.y * v.x;
}

/** fast & furious projection method
     http://www.vcskicks.com/code-snippet/Vector2-projection.php
     */
export function projectFast(p, a, b) {
  var m = (b.y - a.y) / (b.x - a.x);
  var m2 = m * m;
  var i = a.y - m * a.x;
  return new Vector2(
    (m * p.y + p.x - m * i) / (m2 + 1),
    (m2 * p.y + m * p.x + i) / (m2 + 1)
  );
}

/**
 *  returns the reflection of p against the line A-B
 */
export function reflect(p, a, b) {
  var pp = project(p, a, b, false);
  return new Vector2(p.x + (pp.x - p.x) * 2, p.y + (pp.y - p.y) * 2);
}

/**
 *
 * @param p
 * @param a
 * @param b
 * @returns {*}
 */
export function constrain(p, a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  if (dx == 0 && dy == 0) {
    return a;
  } else {
    var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
    t = Math.min(Math.max(0, t), 1);
    return new Vector2(a.x + t * dx, a.y + t * dy);
  }
}

/**
 * checks if the ray from A to B intersects the line C-D
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns {*}
 */
export function raySegmentIntersection(a, b, c, d, asSegment) {
  asSegment = Boolean(asSegment) == true;
  var x1_ = a.x,
    y1_ = a.y,
    x2_ = b.x,
    y2_ = b.y,
    x3_ = c.x,
    y3_ = c.y,
    x4_ = d.x,
    y4_ = d.y;
  var p = null;
  var r, s, d1;
  if ((y2_ - y1_) / (x2_ - x1_) != (y4_ - y3_) / (x4_ - x3_)) {
    d1 = (x2_ - x1_) * (y4_ - y3_) - (y2_ - y1_) * (x4_ - x3_);
    if (d1 != 0) {
      r = ((y1_ - y3_) * (x4_ - x3_) - (x1_ - x3_) * (y4_ - y3_)) / d1;
      s = ((y1_ - y3_) * (x2_ - x1_) - (x1_ - x3_) * (y2_ - y1_)) / d1;
      if (r >= 0) {
        if (!asSegment || (asSegment && s >= 0 && s <= 1))
          p = new Vector2(x1_ + r * (x2_ - x1_), y1_ + r * (y2_ - y1_));
      }
    }
  }
  return p;
}

/**
 * get the bounce vector
 */
export function bounceVector(
  p0,
  p1,
  l0,
  l1,
  PasSegment = true,
  LasSegment = true
) {
  LasSegment = Boolean(LasSegment) == true;
  PasSegment = Boolean(PasSegment) == true;

  var ip = lineIntersectLine(p0, p1, l0, l1, PasSegment, LasSegment);
  if (ip != null) {
    var norm = ip.clone().add(normal(l0, l1).normalize());
    var rp = reflect(p0, ip, norm);
    return [ip, rp];
  }
  return null;
}

/* TODO bounce vector : https://answers.unity.com/questions/880103/vector-based-pong-ball-bounce-calculations.html
  The formula for a standard wall-bounce is:
  -2*(V dot N)*N + V
  where V is the incoming velocity of the ball, and N is the normal-vector
  for the wall/pad i.e. upwards/outwards from the pad, when the long side
  of it is left-to-right, and top and bottom are up and down respectively.
  Because my pad-sprite is like this <======>, I use _transform.up for N.
  For other implementations using pad-sprites that are turned differently,
  _transform.right or an inversion of either might be used.
  First, I find my velocity:
*/

/**
 * returns a Vector2 at a position 't' along a path
 * @param points description of the path
 * @param t a value between 0 & 1
 * @returns {Vector2}
 */
export function getPositionAt(points, t) {
  var length = points.length - 1;
  var i0 = Math.floor(length * t);
  i0 = i0 < length - 1 ? i0 : length - 1;
  var i1 = Math.min(i0 + 1, length);

  var delta = 1 / length;
  var nt = (t - i0 * delta) / delta;
  return (p = new Vector2(
    lerp(nt, points[i0].x, points[i1].x),
    lerp(nt, points[i0].y, points[i1].y)
  ));
}

export function vectorsHaveSameDirection(a, b, c, d) {
  var d0 = a.direction(b);
  var d1 = c.direction(d);
  return d0.dot(d1) > 0;
}

/**
 * offset a polyline by a given amount
 */
export function offsetPolygon(points, offset) {
  var tmp = [];
  var count = points.length;
  for (var j = 0; j < count; j++) {
    // finds the previous, current and next Vector2
    var i = j - 1;
    if (i < 0) i += count;
    var k = (j + 1) % count;

    var pre = points[i];
    var cur = points[j];
    var nex = points[k];

    //create 2 lines, parallel to both edges at a given distance 'offset'

    //computes a normal vector to the direction of the: prev -> current edge of length offset
    var l1 = distance(cur, pre);
    var n1 = {
      x: -((cur.y - pre.y) / l1) * offset,
      y: ((cur.x - pre.x) / l1) * offset,
    };

    //does the same for the : current -> next edge
    var l2 = distance(cur, nex);
    var n2 = {
      x: -((nex.y - cur.y) / l2) * offset,
      y: ((nex.x - cur.x) / l2) * offset,
    };

    //and create 2 points at both ends of the edge to obtain a parallel line
    var p1 = { x: pre.x + n1.x, y: pre.y + n1.y };
    var p2 = { x: cur.x + n1.x, y: cur.y + n1.y };
    var p3 = { x: cur.x + n2.x, y: cur.y + n2.y };
    var p4 = { x: nex.x + n2.x, y: nex.y + n2.y };

    // console.log( p1, p2, p3, p4 );
    var ip = lineIntersectLine(p1, p2, p3, p4);
    if (ip != null) {
      tmp.push(ip);
    }
  }

  return tmp;
}

/******************************************************
  * 
  CIRCLE UTILITIES
  *
*****************************************************/

/**
 * returns a true if the Vector2 is incside the circle, false otherwise
 * @param    p
 * @param    circle
 * @return
 */
export function circleContainsVector2(p, circle) {
  return distance(circle, p) < circle.radius;
}

/**
 * returns a true if circle0 is incside circle1, false otherwise
 * @param    circle0
 * @param    circle1
 * @return
 */
export function circleContainsCircle(circle0, circle1) {
  var R = Math.max(circle0.radius, circle1.radius);
  var r = Math.min(circle0.radius, circle1.radius);

  return distance(circle0, circle1) < R - r;
}

/**
 * returns the closest Vector2 to P on the circle circle
 * @param    p
 * @param    circle
 * @return
 */
export function closestVector2OnCircle(p, circle) {
  var ang = angle(circle, p);
  return setVector2AtAngle(ang, circle);
}

/**
 * places a Vector2 at a given angle on the circle
 * @param    angle
 * @param    circle
 * @return
 */
export function setVector2AtAngle(angle, circle) {
  return new Vector2(
    circle.x + Math.cos(angle) * circle.radius,
    circle.y + Math.sin(angle) * circle.radius
  );
}

/**
 * returns the distance between 2 circles
 * @param    circle0
 * @param    circle1
 * @return
 */
export function circlesDistance(circle0, circle1) {
  return distance(circle0, circle1) - (circle0.radius + circle1.radius);
}

/**
 * returns the two end points of the distance segment between 2 circles
 * @param    circle0
 * @param    circle1
 * @return
 */
export function circlesDistanceSegment(circle0, circle1) {
  var p0, p1;
  if (circleContainsVector2(circle0, circle1)) {
    var ang = angle(circle0, circle1) + PI;
    p0 = setVector2AtAngle(ang, circle0);
    p1 = setVector2AtAngle(ang, circle1);
  } else {
    p0 = closestVector2OnCircle(circle1, circle0);
    p1 = closestVector2OnCircle(circle0, circle1);
  }
  return [p0, p1];
}

// http://htmlcoderhelper.com/find-a-tangent-Vector2-on-circle/
/**
 * returns 0, 1 or 2 points of tangency of a given Vector2 P onto the circle
 * @param    p
 * @param    circle
 * @return
 */
export function tangentsToVector2(p, circle) {
  var ang = angle(circle, p);
  var distance = distance(circle, p);

  if (distance < circle.radius) {
    return null;
  } else if (distance == circle.radius) {
    return [
      new Vector2(
        circle.x + Math.cos(ang) * distance,
        circle.y + Math.sin(ang) * distance
      ),
    ];
  } else {
    var alpha = ang + halfPi - Math.asin(circle.radius / distance);
    var beta = ang - halfPi + Math.asin(circle.radius / distance);

    return [
      new Vector2(
        circle.x + Math.cos(alpha) * circle.radius,
        circle.y + Math.sin(alpha) * circle.radius
      ),

      new Vector2(
        circle.x + Math.cos(beta) * circle.radius,
        circle.y + Math.sin(beta) * circle.radius
      ),
    ];
  }
}

//http://mathworld.wolfram.com/Circle-CircleTangents.html
//http://mathworld.wolfram.com/EyeballTheorem.html
/**
 * return 2 sets of 2 points located on the tangency points of the circle0 onto circle1.
 * @param    circle0
 * @param    circle1
 * @return
 */
export function tangentsToCircle(circle0, circle1) {
  var R = Math.max(circle0.radius, circle1.radius);
  var r = Math.min(circle0.radius, circle1.radius);

  var p0, p1;
  var alpha, beta;

  if (R == r) {
    //circles have same size: tangents are parallel
    p0 = circle0;
    p1 = circle1;
    alpha = beta = angle(p0, p1);
    alpha -= halfPi;
    beta += halfPi;
  } else {
    var dr = R - r;

    p0 = R == circle0.radius ? circle0 : circle1;
    p1 = r == circle0.radius ? circle0 : circle1;

    var c = new Vector2(p0.x, p0.y);
    c.radius = dr;

    var projection = tangentsToVector2(p1, c);

    if (projection == null) return null;

    alpha = angle(c, projection[0]);
    beta = angle(c, projection[1]);
  }

  return [
    new Vector2(p0.x + Math.cos(alpha) * R, p0.y + Math.sin(alpha) * R),

    new Vector2(p1.x + Math.cos(alpha) * r, p1.y + Math.sin(alpha) * r),

    new Vector2(p0.x + Math.cos(beta) * R, p0.y + Math.sin(beta) * R),

    new Vector2(p1.x + Math.cos(beta) * r, p1.y + Math.sin(beta) * r),
  ];
}

/**
 * return a vector tangent to a Vector2
 * @param    p
 * @param    circle
 * @return
 */
export function tangentVector(p, circle) {
  var a = angle(circle, p) + PI / 2;
  return new Vector2(Math.cos(a), Math.sin(a));
}

/**
 * return two Vector2 tangent points spaced by length
 * @param p
 * @param circle
 * @param length
 * @returns {*[]}
 */
export function tangentSegment(p, circle, length) {
  var tv = tangentVector(p, circle).multiplyScalar((length || 100) * 0.5);
  return [tv.clone().add(p), tv.negate().add(p)];
}

//http://mathworld.wolfram.com/Circle-CircleIntersection.html
/**
 * return the chord of the circle-circle intersection between circle0 and circle1
 * @param    circle0
 * @param    circle1
 * @return
 */
export function circlesIntersection(circle0, circle1) {
  var R = circle0.radius;
  var r = circle1.radius;
  var d = distance(circle0, circle1);

  if (d > R + r) return null;

  var baseRadius = (d * d - r * r + R * R) / (2 * d);

  var radius =
    (1 / d) *
    Math.sqrt((-d + r - R) * (-d - r + R) * (-d + r + R) * (d + r + R)) *
    0.5;

  if (radius <= 0) return null;

  var ang = angle(circle0, circle1);

  return [
    new Vector2(
      circle0.x + Math.cos(ang) * baseRadius + Math.cos(ang + halfPi) * radius,
      circle0.y + Math.sin(ang) * baseRadius + Math.sin(ang + halfPi) * radius
    ),

    new Vector2(
      circle0.x + Math.cos(ang) * baseRadius + Math.cos(ang - halfPi) * radius,
      circle0.y + Math.sin(ang) * baseRadius + Math.sin(ang - halfPi) * radius
    ),
  ];

  return null;
}

//http://mathworld.wolfram.com/Circle-LineIntersection.html
/**
 * returns 0, 1 or 2 points of intersection between the line defined by startVector2/endVector2 and the circle
 * @param    startVector2
 * @param    endVector2
 * @param    circle
 * @return
 */
export function lineCircleIntersection(
  startVector2,
  endVector2,
  circle,
  asRay
) {
  asRay = Boolean(asRay) == true;
  var p0 = startVector2.clone().sub(circle);
  var p1 = endVector2.clone().sub(circle);

  var r = circle.radius;
  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;

  var dr = Math.sqrt(dx * dx + dy * dy);
  var dr2 = dr * dr;
  var D = p0.x * p1.y - p1.x * p0.y;
  var discriminant = r * r * dr2 - D * D;

  if (discriminant < 0) return null;

  var sqrtDiscriminant = Math.sqrt(discriminant);

  var x = (D * dy + (dy < 0 ? -1 : 1) * dx * sqrtDiscriminant) / dr2;
  var y = (-D * dx + (dy < 0 ? -dy : dy) * sqrtDiscriminant) / dr2;

  var ips = [new Vector2(x + circle.x, y + circle.y)];

  if (discriminant == 0) return ips;

  if (discriminant > 0) {
    x = (D * dy - (dy < 0 ? -1 : 1) * dx * sqrtDiscriminant) / dr2;
    y = (-D * dx - (dy < 0 ? -dy : dy) * sqrtDiscriminant) / dr2;
    ips.push(new Vector2(x + circle.x, y + circle.y));
  }

  return ips;
}

export function rayCircleIntersection(p0, p1, circle) {
  var d = p1.clone().sub(p0).normalize();
  var m = p0.clone().sub(circle);
  var b = m.dot(d);
  var c = m.dot(m) - circle.radius * circle.radius;
  // Exit if r’s origin outside s (c > 0) and r Vector2ing away from s (b > 0)
  if (c > 0 && b > 0) return null;
  var discr = b * b - c;
  // A negative discriminant corresponds to ray missing sphere
  if (discr < 0) return null;
  // Ray now found to intersect sphere, compute smallest t value of intersection
  var t = -b - Math.sqrt(discr);
  // If t is negative, ray started inside sphere so clamp t to zero
  if (t < 0) return null;
  return p0.clone().add(d.multiplyScalar(t));
}

//http://www.experts-exchange.com/Programming/Game/AI_Physics/Q_24977935.html
/**
 * returns 0, 1 or 2 points of intersection between the segment defined by startVector2/endVector2 and the circle
 * @param    startVector2
 * @param    endVector2
 * @param    circle
 * @return
 */
export function segmentCircleIntersection(startVector2, endVector2, circle) {
  var ips = [];
  var a, b, c, bb4ac;

  var dp = new Vector2(
    endVector2.x - startVector2.x,
    endVector2.y - startVector2.y
  );

  a = dp.x * dp.x + dp.y * dp.y;
  b =
    2 *
    (dp.x * (startVector2.x - circle.x) + dp.y * (startVector2.y - circle.y));
  c = circle.x * circle.x + circle.y * circle.y;
  c += startVector2.x * startVector2.x + startVector2.y * startVector2.y;
  c -= 2 * (circle.x * startVector2.x + circle.y * startVector2.y);
  c -= circle.radius * circle.radius;

  bb4ac = b * b - 4 * a * c;

  if ((a < 0 ? -a : a) < Number.MIN_VALUE || bb4ac < 0) return null;

  var mu1, mu2;
  mu1 = (-b + Math.sqrt(bb4ac)) / (2 * a);
  mu2 = (-b - Math.sqrt(bb4ac)) / (2 * a);

  if ((mu1 < 0 || mu1 > 1) && (mu2 < 0 || mu2 > 1)) return null;

  var p1 = new Vector2(
    startVector2.x + (endVector2.x - startVector2.x) * mu1,
    startVector2.y + (endVector2.y - startVector2.y) * mu1
  );
  var p2 = new Vector2(
    startVector2.x + (endVector2.x - startVector2.x) * mu2,
    startVector2.y + (endVector2.y - startVector2.y) * mu2
  );

  if (mu1 > 0 && mu1 < 1 && (mu2 < 0 || mu2 > 1)) {
    ips.push(p1);
    return ips;
  }
  if (mu2 > 0 && mu2 < 1 && (mu1 < 0 || mu1 > 1)) {
    ips.push(p2);
    return ips;
  }
  if (mu1 > 0 && mu1 < 1 && mu2 > 0 && mu2 < 1) {
    if (mu1 == mu2) {
      ips.push(p1);
    } else {
      ips.push(p1, p2);
    }
    return ips;
  }

  return null;
}

/**
 * return the bounce vectors of a ray
 * @param s
 * @param e
 * @param circle
 * @param asSegment
 * @returns {Array}
 */
export function circleBounceVectors(s, e, circle, asSegment) {
  var ips = lineCircleIntersection(s, e, circle, asSegment);
  console.log(s, e, circle, asSegment);
  if (ips != null) {
    var tmp = [];
    ips.forEach(function (p) {
      var tv = tangentVector(p, circle).add(p);
      tmp.push(bounceVector(s, p, p, tv));
      tmp.push(bounceVector(e, p, p, tv));
    });
    return tmp;
  }
  return null;
}

/**
 * a and b need a vel property
 * @param {Ball} a
 * @param {Ball} b
 */
let zero = new Vector2(0, 0);
export function ballBounce(a, b, ctx) {
  //if balls collide
  if (distance(a, b) < a.radius + b.radius + b.vel.length) {
    console.log("hit", distance(a, b), a.radius, b.radius);
    //TODO fix
    let vc = b.clone().sub(a);
    ctx.strokeStyle = "#0F0";
    ctx.g.line(a, b);

    let vcn = normal(a, b);
    let v1 = a.vel;
    let v2 = b.vel;

    let v1a = project(v1, zero, vc);
    let v1b = project(v1, zero, vcn);

    let v2a = project(v2, zero, vc);
    let v2b = project(v2, zero, vcn);

    a.vel.add(v1b.add(v2a));
    b.vel.add(v1a.add(v2b));
  }
}
//*/
