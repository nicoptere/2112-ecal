//http://www.briangrinstead.com/blog/astar-search-algorithm-in-javascript
export default class Astar {
  static dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static dist_sq(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  static dist_inv(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return -Math.sqrt(dx * dx + dy * dy);
  }

  static dist_adj(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var da = a.adjacency.length - b.adjacency.length;
    return dx * dx + dy * dy + da * da;
  }

  static compute(graph, startNode, endNode, values, distFunction) {
    let metric = distFunction || Astar.dist;

    if (!isNaN(startNode)) startNode = graph.vertices[startNode];
    if (!isNaN(endNode)) endNode = graph.vertices[endNode];

    graph.resetAdjacency();
    graph.vertices.forEach(function (v) {
      v.f = 0;
      v.g = 0;
      v.h = 0;
      v.parent = null;
    });

    var visited = [];
    var unvisited = [];
    unvisited.push(startNode);

    while (unvisited.length > 0) {
      // Grab the lowest f(x) to process next
      var lowInd = 0;
      for (var i = 0; i < unvisited.length; i++) {
        if (unvisited[i].f < unvisited[lowInd].f) {
          lowInd = i;
        }
      }
      var currentNode = unvisited[lowInd];
      // End case -- result has been found, return the traced path
      if (currentNode == endNode) {
        var curr = currentNode;
        var ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        ret.reverse();
        ret.unshift(startNode);
        return ret;
      }

      // Normal case -- move currentNode from open to closed, process each of its adjacency
      unvisited.splice(currentNode, 1);
      visited.push(currentNode);
      // console.log(currentNode, currentNode.adjacency);
      var adjacency = currentNode.adjacency;
      for (i = 0; i < adjacency.length; i++) {
        var adjacent = adjacency[i];
        if (visited.indexOf(adjacent) != -1) {
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //	 the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.g + metric(currentNode, adjacent); // 1 is the distance from a node to it's neighbor
        var gScoreIsBest = false;

        if (unvisited.indexOf(adjacent) == -1) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet
          adjacent.h = metric(adjacent, endNode);
          unvisited.push(adjacent);
          gScoreIsBest = true;
        } else if (gScore < adjacent.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.	 Store info on how we got here and
          //	just how good it really is...
          adjacent.parent = currentNode;
          adjacent.g = gScore;
          adjacent.f = adjacent.g + adjacent.h;
        }
      }
    }
    return [];
  }
}
