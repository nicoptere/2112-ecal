var utils = (function (exports) {
  /*
    compute edges length
     */
  exports.length = function (edge) {
    return Math.abs(edge.v0 - edge.v1);
  };

  exports.length2d = function (edge) {
    var dx = edge.v0.x - edge.v1.x;
    var dy = edge.v0.y - edge.v1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  exports.length3d = function (edge) {
    var dx = edge.v0.x - edge.v1.x;
    var dy = edge.v0.y - edge.v1.y;
    var dz = edge.v0.z - edge.v1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  /**
   * removes a given amount of vertices
   * @param graph the graph to process
   * @param percentage of vertices to remove [0-1]
   * @returns {*}
   */
  exports.decimateVertices = function (graph, ratio) {
    for (var i = graph.vertices.length - 1; i > 0; i--) {
      if (Math.random() < ratio) {
        graph.removeVertexAt(i, true);
      }
    }
    return graph;
  };
  /**
   * removes a given amount of vertices
   * @param graph the graph to process
   * @param percentage of edges to remove [0-1]
   * @returns {*}
   */
  exports.decimateEdges = function (graph, ratio) {
    for (var i = graph.edges.length - 1; i > 0; i--) {
      if (PRNG.random() < ratio) {
        graph.removeEdgeAt(i, false);
      }
    }
    return graph;
  };

  function lerp(t, a, b) {
    return a + t * (b - a);
  }
  function norm(t, a, b) {
    return (t - a) / (b - a);
  }
  function map(t, a0, b0, a1, b1) {
    return a1 + ((t - a0) / (b0 - a0)) * (b1 - a1);
  }

  /**
   * rescales a graph from one coordinate system to another
   * @param g the original grpah
   * @param from the original bounds described as [ x0, y0, x1, y1 ]
   * @param to the destination bounds described as [ x0, y0, x1, y1 ]
   * @returns {*}
   */
  exports.remap = function (g, from, to) {
    g.vertices.forEach(function (v) {
      v.x = map(v.x, from[0], from[2], to[0], to[2]);
      v.y = map(v.y, from[1], from[3], to[1], to[3]);
    });
    return g;
  };

  /*
     renders a 2D graph on a canvas
     */
  exports.render = function (graph, ctx, pointSize, lineSize) {
    //ctx.lineJoin = "round";
    exports.renderEdges(graph, ctx, lineSize);

    // ctx.lineJoin = "mitter";
    exports.renderVertices(graph, ctx, pointSize);
  };
  exports.renderEdges = function (graph, ctx, lineSize, single = false) {
    // ctx.lineJoin = "round";
    // ctx.lineCap = "round";
    ctx.lineWidth = lineSize || 0.5;
    if (single) {
      graph.edges.forEach(function (e, i) {
        ctx.strokeStyle = "hsl(" + ~~(i % 360) + ", 80%,50% )";
        ctx.beginPath();
        ctx.moveTo(e.v0.x, e.v0.y);
        ctx.lineTo(e.v1.x, e.v1.y);
        ctx.stroke();
      });
    } else {
      graph.edges.forEach(function (e) {
        ctx.beginPath();
        ctx.moveTo(e.v0.x, e.v0.y);
        ctx.lineTo(e.v1.x, e.v1.y);
        ctx.stroke();
      });
    }
  };
  exports.renderBiEdges = function (graph, ctx, out, ins) {
    graph.edges.forEach(function (e, i) {
      ctx.lineWidth = out;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(e.v0.x, e.v0.y);
      ctx.lineTo(e.v1.x, e.v1.y);
      ctx.stroke();
      ctx.lineWidth = ins;
      ctx.strokeStyle = "#FFF";
      ctx.beginPath();
      ctx.moveTo(e.v0.x, e.v0.y);
      ctx.lineTo(e.v1.x, e.v1.y);
      ctx.stroke();
    });
  };

  exports.renderVertices = function (graph, ctx, pointSize = 3) {
    ctx.lineCap = "round";
    ctx.lineWidth = pointSize;
    ctx.beginPath();
    graph.vertices.forEach(function (v) {
      ctx.moveTo(v.x, v.y);
      ctx.lineTo(v.x + 0.5, v.y);
    });
    ctx.stroke();
  };

  exports.renderDiscs = function (graph, ctx, pointSize = 3) {
    graph.vertices.forEach(function (v) {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 1 + v.adjacency.length * pointSize, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  exports.renderLabel = function (graph, ctx) {
    ctx.font = "10px Verdana";
    ctx.fillStyle = "#000";
    graph.vertices.forEach(function (v, i) {
      ctx.fillText(i, v.x, v.y - 10);
    });
  };
  return exports;
})({});
