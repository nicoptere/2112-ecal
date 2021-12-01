/*
finds the Kruskal minimum spanning tree of a graph
*/
let parent = [];
let rank = [];
let tree = [];
let sortedEdges = [];
export default class MinimumSpanningTree {
  static _metric(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  static _sortMethod(edge0, edge1) {
    return edge0.weight - edge1.weight;
  }

  static find(vertex) {
    if (parent[vertex.id] == vertex) {
      return parent[vertex.id];
    } else {
      return this.find(parent[vertex.id]);
    }
  }

  static union(root0, root1) {
    let id0 = root0.id;
    let id1 = root1.id;
    if (rank[id0] > rank[id1]) {
      parent[id1] = root0;
    } else if (rank[id0] < rank[id1]) {
      parent[id0] = root1;
    } else {
      parent[id0] = root1;
      rank[id1]++;
    }
  }

  /*
   * computes and returns a Minimum Spanning Tree using the Kruskal Algorithm
   * @param graph object to compute the MST of
   * @param metric a function( edge ) to compute the weight of the edge
   * @param sortMethod a sort function( edge0, edge1 ) to sort edges by increasing weight
   * @constructor
   */
  static compute(graph, values, distFunction, sortMethod) {
    let metric = distFunction || this._metric; //utils.length2d;
    sortMethod = sortMethod || this._sortMethod;

    parent = [];
    rank = [];
    tree = [];

    graph.vertices.forEach(function (vertex, i) {
      if (values && values.indexOf(vertex.value) == -1) return;
      vertex.id = i;
      parent[vertex.id] = vertex;
      rank[vertex.id] = 0;
    });

    sortedEdges = [];
    graph.edges.forEach(function (e, i) {
      if (values) {
        if (values.indexOf(e.v0.value) == -1) return;
        if (values.indexOf(e.v1.value) == -1) return;
      }
      e.id = i;
      if (e.weight === undefined) e.weight = metric(e.v0, e.v1);
      sortedEdges.push(e);
    });
    sortedEdges.sort(sortMethod);

    for (let i = 0; i < sortedEdges.length; i++) {
      let edge = sortedEdges[i];
      let root1 = this.find(edge.v0);
      let root2 = this.find(edge.v1);
      if (root1 != root2) {
        tree.push(edge);
        this.union(root1, root2);
      }
      if (tree.length == graph.vertices.length - 1) {
        return tree;
      }
    }
    return tree;
  }
}
