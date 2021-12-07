import { Mesh } from "three";
import MoebiusGeometry from "./MoebiusGeometry";
import MoebiusMaterial from "./MoebiusMaterial";

export default class Moebius extends Mesh {
  constructor(config) {
    super(new MoebiusGeometry(config), new MoebiusMaterial(config));
  }

  reset(config) {
    this.geometry = new MoebiusGeometry(config);
  }

  update() {
    this.material.uniforms.time.value = performance.now() * 0.001;
  }
}
