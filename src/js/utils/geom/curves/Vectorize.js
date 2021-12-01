import Simplify from "./Simplify";
let minBranchLength;
export default class Vectorize {
  static xyToIndex(x, y, w) {
    return x + y * w;
  }

  static indexToXY(id, w) {
    return [id % w, ~~(id / w)];
  }

  static test(id, r) {
    var xy = this.indexToXY(id, r.w);
    return xy[0] >= 0 && xy[0] < r.w && xy[1] >= 0 && xy[1] < r.h;
  }

  static getAdjacency(i, rect, bits) {
    var w = rect.w;
    var r = [];
    if (this.test(i - w, rect) && bits[i - w] != 0) r.push(i - w);
    if (this.test(i + 1, rect) && bits[i + 1] != 0) r.push(i + 1);
    if (this.test(i + w, rect) && bits[i + w] != 0) r.push(i + w);
    if (this.test(i - 1, rect) && bits[i - 1] != 0) r.push(i - 1);
    if (this.test(i - w + 1, rect) && bits[i - w + 1] != 0) r.push(i - w + 1);
    if (this.test(i + w + 1, rect) && bits[i + w + 1] != 0) r.push(i + w + 1);
    if (this.test(i + w - 1, rect) && bits[i + w - 1] != 0) r.push(i + w - 1);
    if (this.test(i - w - 1, rect) && bits[i - w - 1] != 0) r.push(i - w - 1);
    return r;
  }

  static findPath(i, r, bits, branches) {
    bits[i] = 0;
    let b = [i];

    var adjacency = this.getAdjacency(i, r, bits);
    while (adjacency.length > 0) {
      var id = adjacency[0];
      bits[id] = 0;
      b.push(id);
      adjacency = this.getAdjacency(id, r, bits);
    }
    if (b.length > minBranchLength) branches.push(b);
  }

  static compute(coords, rect, params) {
    minBranchLength = params.minBranchLength || 3;
    let simplifyTolerance = params.simplifyTolerance || 5;

    var w = rect.w;
    var h = rect.h;
    var bits = new Array();
    for (var i = w * h; i > 0; i--) bits.push(0);
    for (var i = 0; i < coords.length; i += 2) {
      var id = this.xyToIndex(coords[i], coords[i + 1], w);
      bits[id] = 1;
    }

    var branches = [];
    for (var i = 0; i < bits.length; i++) {
      var v = bits[i];
      if (v === 0) continue;
      this.findPath(i, rect, bits, branches);
    }

    var paths = [];
    var simple = [];
    branches.forEach((b) => {
      var pts = b.map((id) => {
        return this.indexToXY(id, w);
      });
      paths.push(pts);
      var s = Simplify.compute(pts, simplifyTolerance, { x: 0, y: 1 });
      simple.push(s);
    });
    return { branches, paths, simple };
  }
}
