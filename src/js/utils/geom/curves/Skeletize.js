let W = 0;
let H = 0;
let L = 0;
let points = null;
let output = null;
let count, n, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12;
export default class skeletize {
  static compute(idata, w, h, threshold) {
    W = w;
    H = h;
    L = w * h;
    points = [];
    output = [];
    for (var i = 0; i < idata.data.length; i += 4) {
      points.push(idata.data[i] < threshold);
      output.push(idata.data[i] < threshold);
    }

    //perform skeletonization
    var count = this.thinning();
    var last = -1;
    while (count != last) {
      count = this.thinning();
      last = this.thinning();
    }

    var coords = [];
    for (var x = 0; x < W; x++) {
      for (var y = 0; y < H; y++) {
        if (this.getValue(x, y)) {
          coords.push(x, y);
        }
      }
    }
    return coords;
  }

  static getValue(x, y) {
    return points[W * y + x];
  }
  setValue(x, y, value) {
    points[W * y + x] = value;
  }

  static thinning() {
    count = 0;
    for (var x = 2; x < W - 2; x++) {
      for (var y = 2; y < H - 2; y++) {
        n = y * W + x;

        p1 = points[n];
        if (p1) {
          //condition 1
          var c = 0;
          p2 = points[n - W];
          p3 = points[n - W + 1];
          p4 = points[n + 1];
          p5 = points[n + W + 1];
          p6 = points[n + W];
          p7 = points[n + W - 1];
          p8 = points[n - 1];
          p9 = points[n - W - 1];

          if (p2) c++;
          if (p3) c++;
          if (p4) c++;
          if (p5) c++;
          if (p6) c++;
          if (p7) c++;
          if (p8) c++;
          if (p9) c++;

          if (c > 1 && c < 7) {
            //condition 2
            if (this.evaluate(p2, p3, p4, p5, p6, p7, p8, p9) == 1) {
              //condition 3
              p10 = points[n - 2 * W - 1];
              p11 = points[n - 2 * W];
              p12 = points[n - 2 * W + 1];

              if (
                !p2 ||
                !p4 ||
                !p8 ||
                this.evaluate(p11, p12, p3, p4, p1, p8, p9, p10) != 1
              ) {
                //condition 4
                p10 = points[n - W + 2];
                p11 = points[n + 2];
                p12 = points[n + W + 2];

                if (
                  !p2 ||
                  !p4 ||
                  !p6 ||
                  this.evaluate(p3, p10, p11, p12, p5, p6, p1, p2) != 1
                ) {
                  output[n] = false;
                }
              }
            }
          }
          count++;
        }
      }
    }
    points = output;
    return count;
  }

  static evaluate(p2, p3, p4, p5, p6, p7, p8, p9) {
    var c = 0;
    if (!p2 && p3) c++;
    if (!p3 && p4) c++;
    if (!p4 && p5) c++;
    if (!p5 && p6) c++;
    if (!p6 && p7) c++;
    if (!p7 && p8) c++;
    if (!p8 && p9) c++;
    if (!p9 && p2) c++;
    return c;
  }

  //more about skeletonization
  //https://www.rupj.net/portfolio/docs/skeletonization.pdf
}
