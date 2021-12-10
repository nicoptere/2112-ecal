import { CanvasTexture, DoubleSide, ShaderMaterial, Vector2 } from "three";
import vs from "../glsl/bird_vertex.glsl";
import fs from "../glsl/bird_fragment.glsl";
export default class Pattern3DMaterial extends ShaderMaterial {
  constructor(canvas) {
    super({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1 },
        mouse: { value: new Vector2() },
        map: { value: null },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader: vs,
      fragmentShader: fs,
    });
    this.uniforms.map.value = new CanvasTexture(canvas);
  }
  update(t) {
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.time.value = t;
  }
}
