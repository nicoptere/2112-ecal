import { BoxBufferGeometry, Mesh, Object3D, PlaneBufferGeometry } from "three";
import Block3DMaterial from "./Block3DMaterial";
import Pattern3DMaterial from "./Pattern3DMaterial";

export default class Pattern3D extends Object3D {
  constructor(pattern, palette, size) {
    super();
    //redimensionne en X/Y
    this.scale.x = size;
    this.scale.y = size;
    this.scale.z = size;

    //crée un plane pour afficher le motif
    this.plane = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new Pattern3DMaterial(pattern.canvas)
    );
    this.add(this.plane);

    //mesh pour faire du volume
    let z = 0.1; // épaisseur du cube
    this.box = new Mesh(
      new BoxBufferGeometry(1, 1, z),
      new Block3DMaterial(palette.nextColor())
    );
    this.add(this.box);

    //déplace la boite un peu derrière
    this.box.position.z -= z * 0.65;
  }
  update() {}
}
