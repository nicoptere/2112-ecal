import { Color, DoubleSide, ShaderMaterial } from "three";
import vs from "../glsl/block_vertex.glsl";
import fs from "../glsl/block_fragment.glsl";
export default class Block3DMaterial extends ShaderMaterial {
  constructor(color) {
    super({
      uniforms: {
        time: { value: 0 },
        color: { value: new Color(color) },
      },
      side: DoubleSide,
      transparent: false,
      vertexShader: vs,
      fragmentShader: fs,
    });
  }
  update() {
    this.uniforms.time.value = performance.now();
  }
}
