export default class CatmullRom {
  constructor(precision, from, to) {
    this.precision = precision || 0.1;
    this.from = from || 0;
    this.to = to || 1;
  }

  static getPointAt(t, points, p) {
    if (points === undefined) return null;
    if (p === undefined) p = { x: 0, y: 0 };
    var i = Math.floor(points.length * t);
    var delta = 1 / points.length;
    t = (t - i * delta) / delta;
    let p0 = points[Math.max(0, i - 1)];
    let p1 = points[i];
    let p2 = points[Math.min(i + 1, points.length - 1)];
    let p3 = points[Math.min(i + 2, points.length - 1)];
    p[0] =
      0.5 *
      (2 * p1[0] +
        t *
          (-p0[0] +
            p2[0] +
            t *
              (2 * p0[0] -
                5 * p1[0] +
                4 * p2[0] -
                p3[0] +
                t * (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]))));
    p[1] =
      0.5 *
      (2 * p1[1] +
        t *
          (-p0[1] +
            p2[1] +
            t *
              (2 * p0[1] -
                5 * p1[1] +
                4 * p2[1] -
                p3[1] +
                t * (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]))));
    return p;
  }
  static compute(points, precision, target = null) {
    let from = 0;
    let to = 1;
    if (target === null) target = [];

    var t = Math.min(from, to);
    var max = Math.max(from, to);
    var increment = precision / points.length;
    while (t < max - increment / precision + increment) {
      target.push(this.getPointAt(t, points));
      t += increment;
    }
    return target;
  }
}
