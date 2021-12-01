import { Vector2 } from "../geom/Vector";
export default class Vertex extends Vector2 {
  constructor(x, y, options) {
    super(x, y);
    Object.assign(this, options);
    this.adjacency = [];
    this.edges = [];
  }
  clone() {
    return new Vertex(this.x, this.y, this);
  }
}
