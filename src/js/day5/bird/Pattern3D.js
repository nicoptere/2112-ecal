import { BoxBufferGeometry, Mesh, Object3D, PlaneBufferGeometry } from "three";
import Block3DMaterial from "./Block3DMaterial";
import Pattern3DMaterial from "./Pattern3DMaterial";

export default class Pattern3D extends Object3D {
  constructor(pattern, palette) {
    super();

    //crée un plane pour afficher le motif
    this.plane = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new Pattern3DMaterial(pattern.canvas)
    );
    this.add(this.plane);

    //mesh pour faire du volume
    this.box = new Mesh(
      new BoxBufferGeometry(1, 1, 1),
      // new Pattern3DMaterial(pattern.canvas)
      new Block3DMaterial(palette.nextColor())
    );
    this.add(this.box);

    //déplace la boite un peu derrière
    this.box.position.z -= 0.51;
  }

  set opacity(value) {
    this.plane.material.opacity = value;
    this.box.material.opacity = value;
  }
  get opacity() {
    return this.box.material.opacity;
  }
  update() {
    let t = performance.now() * 0.001;

    // this.opacity = Math.abs(Math.sin(t));
    this.plane.material.update(t);
    this.box.material.update(t);

    // console.log(this.opacity);
    // this.scale.x = 0.1 + Math.cos(t);
    // this.position.x = Math.cos(t);
    // this.position.y = Math.sin(t);
  }
}
