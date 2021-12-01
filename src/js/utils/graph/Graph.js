import { a_adjacency, a_getValues } from "../ArrayUtils";
import Vertex from "./Vertex";
import Edge from "./Edge";

export default class Graph {
  static fromArray(arr, w, connexity = 8, nullValue = -1) {
    let vs = [];
    let es = [];
    arr.forEach((v, i) => {
      if (v === nullValue) return;
      vs.push(new Vertex(i % w, ~~(i / w), { id: i, value: v }));
    });

    vs.forEach((vertex) => {
      let i = vertex.id;
      let v = vertex.value;
      if (v === nullValue) return;
      let cx = a_adjacency(arr, w, i, connexity);
      cx.forEach((oid) => {
        if (arr[oid] === undefined) return;
        if (arr[oid] === nullValue) return;
        if (arr[oid] == v) {
          try {
            es.push(
              new Edge(
                vertex,
                vs.find((v) => v.id == oid)
              )
            );
          } catch (e) {
            console.log(vertex, oid, vs[arr[oid]]);
          }
        }
      });
    });

    let g = new Graph(vs, es);
    g.removeDuplicateEdges();
    g.resetAdjacency();
    return g;
  }

  constructor(vertices = [], edges = []) {
    this.vertices = vertices;
    this.edges = edges;
  }

  addVertex(vertex) {
    this.vertices.push(vertex);
  }

  shave(times = 1) {
    let ends = this.getEnds();
    if (ends.length > 0) {
      ends.forEach((v) => {
        this.removeVertex(v, true);
      });
    }
    if (--times > 0) {
      return this.shave(times);
    }
  }

  removeVertex(vertex, deleteEdges) {
    if (vertex == null) return;
    deleteEdges = deleteEdges == null ? false : Boolean(deleteEdges);
    var id = this.vertices.indexOf(vertex);
    if (id != -1) {
      if (deleteEdges) {
        this.getEdgesByVertex(vertex).forEach((e) => {
          this.removeEdge(e, false);
        });
      }
      this.vertices.splice(id, 1);
    }
  }

  removeVertexAt(id, deleteEdges) {
    return this.removeVertex(this.vertices[id], deleteEdges);
  }

  addEdge(edge) {
    this.edges.push(edge);
  }

  removeEdge(edge, deleteVertices) {
    if (edge == null) return;
    deleteVertices = deleteVertices == null ? false : Boolean(deleteVertices);

    var id = this.edges.indexOf(edge);
    if (id != -1) {
      if (deleteVertices) {
        this.removeVertex(edge.v0, false);
        this.removeVertex(edge.v1, false);
      }
      this.edges.splice(id, 1);
    }
  }

  getEdgesByVertex(vertex) {
    var edges = [];
    this.edges.forEach((e) => {
      if (e.v0 == vertex || e.v1 == vertex) edges.push(e);
    });
    return edges;
  }
  removeEdgeAt(id, deleteVertices) {
    return this.removeEdge(this.edges[id], deleteVertices);
  }

  //finds all vertices connected to one vertex only
  getEnds() {
    var ends = [];
    this.vertices.forEach((v) => {
      v.connexions = 0;
    });

    this.edges.forEach((e) => {
      e.v0.connexions++;
      e.v1.connexions++;
    });

    this.vertices.forEach((v, i) => {
      if (v.connexions <= 1) ends.push(v);
    });
    this.ends = ends;
    return ends;
  }
  getConnectedVertices(count = 2) {
    var ends = [];
    this.vertices.forEach((v) => {
      v.connexions = 0;
    });

    this.edges.forEach((e) => {
      e.v0.connexions++;
      e.v1.connexions++;
    });

    this.vertices.forEach((v, i) => {
      if (v.connexions == count) ends.push(v);
    });
    this.ends = ends;
    return ends;
  }

  flush() {
    this.vertices.forEach((v) => {
      v.adjacency = [];
      v.edges = [];
    });

    this.edges.forEach((e) => {
      if (e.v0.adjacency.indexOf(e.v1) == -1) {
        e.v0.adjacency.push(e.v1);
      }
      if (e.v1.adjacency.indexOf(e.v0) == -1) e.v1.adjacency.push(e.v0);
    });
  }

  removeDuplicateEdges() {
    var tmp = [];
    this.edges.forEach((e) => {
      var exists = false;
      tmp.forEach((o) => {
        if (exists) return;
        if (o.equals(e)) exists = true;
      });
      if (!exists) tmp.push(e);
    });
    this.edges = tmp;
    return this;
  }

  resetAdjacency() {
    // this.adjacency = [];
    // var adjacency = this.adjacency;
    var vertices = this.vertices;

    vertices.forEach((v) => {
      v.adjacency = [];
      v.connexions = 0;
      v.edges = [];
    });

    this.edges.forEach((e) => {
      e.visited = false;

      e.v0.edges.push(e);
      e.v1.edges.push(e);

      e.v0.connexions++;
      e.v1.connexions++;

      e.v0.adjacency.push(e.v1);
      e.v1.adjacency.push(e.v0);
    });
  }

  getPolylines() {
    var graph = this.clone();
    var vertices = graph.vertices;
    var adj = graph.resetAdjacency();
    var max = 50000;
    var visited = 0;
    var total = graph.edges.length;
    var lines = [];
    while (visited < total && max--) {
      graph.resetAdjacency();
      ends = graph.getEnds();

      ends.forEach((v) => {
        var tmp = [];
        tmp.push(v);
        while (v.edges.length < 2) {
          var e = v.edges[0];
          if (e == undefined) {
            break;
          }
          e.visited = true;
          visited++;

          var o = e.other(v);
          v.edges.splice(v.edges.indexOf(e), 1);
          v.adjacency.splice(vertices.indexOf(o), 1);

          tmp.push(o);
          o.adjacency.splice(vertices.indexOf(v), 1);
          if (o.edges.length > 2) {
            break;
          }
          o.edges.splice(o.edges.indexOf(e), 1);
          v = o;
        }
        if (tmp.length > 1) lines.push(tmp);
      });
      graph.edges = graph.edges.filter((e) => {
        return !e.visited;
      });
    }
    lines.forEach((l) => {
      l.forEach((v, i) => {
        var id = vertices.indexOf(v);
        v.connexions = adj[id].length;
      });
    });
    return lines;
  }

  /*
    turns the graph into a dictionary so you can access vertices directly like:  G[ key ] -> vertex
    @param key the property of the vertex that will be used as a dictionary key
     */
  buildDictionary(key) {
    this.vertices.forEach((v) => {
      this[v[key]] = v;
    });
    return this;
  }

  collapse(deep) {
    var vertices = [];
    var edges = [];
    var v0, v1;
    this.edges.forEach((e) => {
      v0 = this.vertices[this.vertices.indexOf(e.v0)];
      v1 = this.vertices[this.vertices.indexOf(e.v1)];
      if (Boolean(deep)) {
        v0 = v0.clone();
        v1 = v1.clone();
      }
      vertices.push(v0, v1);
      edges.push(new Edge(v0, v1));
    });
    this.vertices = vertices;
    this.edges = edges;
  }

  clone() {
    //stores connection informations
    var bindings = [];
    this.edges.forEach((e) => {
      bindings.push([this.vertices.indexOf(e.v0), this.vertices.indexOf(e.v1)]);
    });
    //clone vertices
    var vertices = [];
    this.vertices.forEach((v) => {
      vertices.push(v.clone());
    });
    var edges = [];
    bindings.forEach((bind) => {
      edges.push(new Edge(vertices[bind[0]], vertices[bind[1]]));
    });
    return new Graph(vertices, edges);
  }

  removeDuplicateVertices(epsilon = 0) {
    var tmp = [];

    this.vertices.forEach((v) => {
      var add = true;
      tmp.forEach((o) => {
        if (add == false) return;
        if (v.nearEquals(o, epsilon)) add = false;
      });
      if (add == true) {
        v.id = tmp.length;
        tmp.push(v);
      }
    });
    console.log("removeduplicate vertices", this.vertices.length, tmp.length);
    this.vertices = tmp;
  }

  render(ctx, values = null, debug = false) {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (debug) {
      this.edges.forEach(function (e, i) {
        ctx.strokeStyle = "hsl(" + ~~(i % 360) + ", 80%,50% )";
        ctx.beginPath();
        ctx.moveTo(e.v0.x, e.v0.y);
        ctx.lineTo(e.v1.x, e.v1.y);
        ctx.stroke();
      });
    } else {
      ctx.beginPath();
      this.edges.forEach(function (e) {
        if (values != null && values.indexOf(e.v0.value) != -1) {
          ctx.moveTo(e.v0.x, e.v0.y);
          ctx.lineTo(e.v1.x, e.v1.y);
        }
        //  else {
        //   ctx.moveTo(e.v0.x, e.v0.y);
        //   ctx.lineTo(e.v1.x, e.v1.y);
        // }
      });
      ctx.stroke();
    }
  }
}
