import { BackSide, Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";

export default class Background extends Mesh {
  constructor(parent) {
    let g = new SphereBufferGeometry(1, 64, 32);
    let m = new MeshBasicMaterial({ color: 0xff0000, side: BackSide });
    super(g, m);
    this.scale.multiplyScalar(5000);

    m.onBeforeCompile = (mat) => {
      let vs = mat.vertexShader;
      vs = vs.replace("<common>", `<common> varying float vHeight;`);
      vs = vs.replace("<begin_vertex>", `<begin_vertex> vHeight = position.y;`);
      mat.vertexShader = vs;

      let fs = mat.fragmentShader;
      fs = fs.replace(
        "<common>",
        `<common> varying float vHeight;
        float gain(float x, float k){
            float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
            return (x<0.5)?a:1.0-a;
        }`
      );
      fs = fs.replace(
        "<dithering_fragment>",
        `<dithering_fragment>
        gl_FragColor.rgb = mix(vec3( 0.35), vec3( .55), gain( smoothstep( -.5, .5, vHeight + .25 ), 4. ) );`
      );
      mat.fragmentShader = fs;
    };

    parent.add(this);
  }
}
