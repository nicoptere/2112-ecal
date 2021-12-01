/**
 computes the Dijkstra shortest distance on a graph
*/
export default class Dijkstra {
  static dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  //buildis adjacency list
  static compute(graph, rootNode, endNode, distFunction = null) {
    if (!isNaN(rootNode)) rootNode = graph.vertices[rootNode];
    if (!isNaN(endNode)) endNode = graph.vertices[endNode];

    let metric = distFunction || this.dist;
    var dist = new Float32Array(graph.vertices.length);
    var adjacent = [];
    var cost = [];
    var prev = [];
    var queue = [];

    //inits a list
    graph.vertices.forEach(function (v, i) {
      v.prev = null;
      //initializes the distance to root at 0 ( ensures that root is the closest node to itself )
      dist[i] = v == rootNode ? 0 : Number.POSITIVE_INFINITY;

      //stores the adjacency and the edges costs
      var adj = new Int16Array(v.adjacency.length);
      var cos = new Float32Array(v.adjacency.length);

      v.adjacency.forEach(function (n, j) {
        adj[j] = graph.vertices.indexOf(n);
        cos[j] = metric(v, n);
      });
      adjacent.push(adj);
      cost.push(cos);
      queue.push(i);
    });

    var current, i, id, vertex, alt, min;
    while (queue.length > 0) {
      //select the closest vertex
      min = Number.POSITIVE_INFINITY;
      for (i = 0; i < queue.length; i++) {
        id = queue[i];
        if (dist[id] < min) {
          min = dist[id];
          current = id;
        }
      }

      //removes current node from the queue
      queue.splice(queue.indexOf(current), 1);

      //for all adjacency of current, update distance to target node
      for (i = 0; i < adjacent[current].length; i++) {
        vertex = adjacent[current][i];
        alt = dist[current] + cost[current][i];

        if (alt < dist[vertex]) {
          dist[vertex] = alt;
          prev[vertex] = current;
        }
      }
    }
    prev.forEach(function (id, i) {
      graph.vertices[i].prev = graph.vertices[id];
    });

    var prevlist = [];
    graph.vertices.forEach(function (v, i) {
      prevlist.push(graph.vertices.indexOf(v.prev));
    });

    return this.getShortestPath(graph, endNode);
  }

  //computes and returns shortest path from the root to the target vertices
  static getShortestPath(graph, target) {
    if (!isNaN(target)) target = graph.vertices[target];
    var nodes = [];
    //otherwise list all nodes from the target to the root node
    while (target.prev != null) {
      nodes.unshift(target);
      target = target.prev;
    }
    nodes.unshift(target);
    return nodes;
  }
}
