import { Color, DoubleSide, ShaderMaterial } from "three";
import vs from "../glsl/block_vertex.glsl";
import fs from "../glsl/block_fragment.glsl";
export default class Block3DMaterial extends ShaderMaterial {
  constructor(color) {
    super({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1 },
        color: { value: new Color(color) },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader: vs,
      fragmentShader: fs,
    });
  }
  update(t) {
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.time.value = t;
  }
}
