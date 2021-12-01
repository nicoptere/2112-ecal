export default class Edge {
  constructor(v0, v1, options, directed = false) {
    this.v0 = v0;
    this.v1 = v1;
    Object.assign(this, options);
    if (v0.adjacency.indexOf(v1) == -1) v0.adjacency.push(v1);
    if (directed !== true) v1.adjacency.push(v0);
  }

  clone(deep) {
    deep = deep == null ? false : Boolean(deep);

    var e;
    if (deep) {
      e = new Edge(this.v0.clone(), this.v1.clone(), this.data);
    } else {
      e = new Edge(this.v0, this.v1, this.data);
    }
    e.id = this.id;
    return e;
  }

  equals(other) {
    return (
      (this.v0 === other.v0 && this.v1 === other.v1) ||
      (this.v0 === other.v1 && this.v1 === other.v0)
    );
  }

  flip() {
    var v = this.v1;
    this.v1 = this.v0;
    this.v0 = v;
    return this;
  }

  other(other) {
    return this.v0 === other ? this.v1 : this.v0;
  }
}
