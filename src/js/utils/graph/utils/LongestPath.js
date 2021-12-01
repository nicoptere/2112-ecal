export default class LongestPath {
  compute(graph, start) {
    let vs = graph.vertices;
    let N = vs.length;
    if (N === 1) return [0];
    if (N === 2) return [0, 1];

    let max = N ** 2;
    // console.log("max", max);
    let tot = max;
    let best = [];

    // console.time("path");
    let SG = [];
    let W = [];
    vs.forEach((v, id) => {
      SG.push(
        v.adjacency.map((o) => {
          return vs.indexOf(o);
        })
      );
      W.push(
        v.adjacency.map((o) => {
          return distance(v, o) * 2;
        })
      );
    });

    let startPositions = graph.getEnds().map((v) => {
      return vs.indexOf(v);
    });
    let randomizeStart = Boolean(start === undefined);
    if (randomizeStart) {
      startPositions = graph.getEnds().map((v) => {
        return vs.indexOf(v);
      });
      // console.log(startPositions);
      startPositions.reverse();
    }

    let visited = new Set();
    while (tot--) {
      if (randomizeStart) {
        if (startPositions.length > 0) {
          // start = startPositions[~~(Math.random() * startPositions.length)];
          start = startPositions.push(startPositions.shift());
          start = startPositions[0];
        } else {
          start = ~~(Math.random() * vs.length);
        }
      }

      let G = SG.concat();
      let id = start;
      let path = [id];
      visited.clear();
      visited.add(id);
      let next;
      for (let i = 0; i < N; i++) {
        if (G[id].length == 0) break;
        //sort edges by length (longest first)
        G[id].sort((a, b) => {
          let ia = G[id].indexOf(a);
          let ib = G[id].indexOf(b);
          return W[id][ib] - W[id][ia];
        });

        next = G[id][~~(Math.random() * G[id].length)];
        let maxi = G[id].length + 1;
        while (visited.has(next) && maxi--) {
          next = G[id][~~(Math.random() * G[id].length)];
        }
        W[id].splice(G[id].indexOf(next), 1);
        G[id].splice(next, 1);
        if (visited.has(next)) {
          continue;
        }
        visited.add(next);
        path.push(next);
        if (path.length == N) {
          // console.timeEnd("path");
          // console.log("full path", max - tot, "iterations");
          return path;
        }
        id = next;
      }
      if (path.length > best.length) best = path;
    }
    // console.timeEnd("path");
    // console.log("path length", best.length, "/", N, max - tot, "iterations");
    // console.log(N, best);
    return best;
  }
}
