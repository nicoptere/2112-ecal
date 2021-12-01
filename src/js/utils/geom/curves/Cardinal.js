export default class Cardinal {
  static compute(points, precision, tension, radius = 50) {
    precision = Math.max(0.01, Math.min(1, precision || 0.1));
    tension = Math.max(-5, Math.min(5, tension || 1));

    var tmp = [],
      p0,
      p1,
      p2,
      p3,
      i = 0,
      t = 0;

    for (i = 0; i < points.length; i++) {
      p0 = i < 1 ? points[0] : points[i - 1];
      p1 = points[i];
      p2 = points[Math.min(i + 1, points.length - 1)];
      p3 = points[Math.min(i + 2, points.length - 1)];

      let x = p1.lng - p2.lng;
      let y = p1.lat - p2.lat;
      let d = Math.min(Math.sqrt(x * x + y * y) / radius, 1);
      let pre = Math.max(precision, 1 - d);
      let ten = Math.max(-5, Math.min(5, tension * d));

      for (t = 0; t < 1; t += pre) {
        tmp.push([
          // x
          ten * (-t * t * t + 2 * t * t - t) * p0[0] +
            ten * (-t * t * t + t * t) * p1[0] +
            (2 * t * t * t - 3 * t * t + 1) * p1[0] +
            ten * (t * t * t - 2 * t * t + t) * p2[0] +
            (-2 * t * t * t + 3 * t * t) * p2[0] +
            ten * (t * t * t - t * t) * p3[0],

          // y
          ten * (-t * t * t + 2 * t * t - t) * p0[1] +
            ten * (-t * t * t + t * t) * p1[1] +
            (2 * t * t * t - 3 * t * t + 1) * p1[1] +
            ten * (t * t * t - 2 * t * t + t) * p2[1] +
            (-2 * t * t * t + 3 * t * t) * p2[1] +
            ten * (t * t * t - t * t) * p3[1],
        ]);
      }
    }
    return tmp;
  }
}
