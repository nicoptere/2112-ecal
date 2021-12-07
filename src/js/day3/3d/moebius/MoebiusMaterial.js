import {
  EquirectangularReflectionMapping,
  MeshPhysicalMaterial,
  TextureLoader,
} from "three";

let tl;
export default class MoebiusMaterial extends MeshPhysicalMaterial {
  constructor(config) {
    super({
      envMap: null,
      roughness: config.roughness,
      metalness: config.metalness,
      envMapIntensity: config.envMapIntensity,
    });

    tl = new TextureLoader();
    tl.load("assets/env.png", (t) => {
      this.envMap = t;
      t.mapping = EquirectangularReflectionMapping;
      t.needsUpdate = true;
    });

    const uniforms = {
      time: { value: 0 },
      radius: { value: config.radius },
      turns: { value: config.turns },
      speed: { value: config.speed },
      axialSpeed: { value: config.axialSpeed },
    };
    this.uniforms = uniforms;
    this.onBeforeCompile = (m) => {
      Object.assign(m.uniforms, uniforms);
      let vs = m.vertexShader;
      vs = vs.replace(
        "<common>",
        `<common>
        attribute vec4 section;
        attribute vec3 color;
        uniform float radius;
        uniform float turns;
        uniform float time;
        uniform float speed;
        uniform float axialSpeed;
        #define TAU PI * 2.
        varying vec3 vColor;`
      );
      vs = vs.replace(
        "<begin_vertex>",
        `<begin_vertex>
        
        vec3 pos = position;
        
        //rescale
        pos *= section.w;

        //place sur le carré avec la rotation axiale
        float r = length( section.xy );
        float a = atan( section.y, section.x ) + section.z *( TAU * turns ) + time * axialSpeed;
        pos.x += cos( a ) * r;
        pos.z += sin( a ) * r;
        
        //aligne le long du cercle
        float t = time * speed + section.z * TAU + ( TAU * turns );
        float c = cos( t );
        float s = sin( t );
        mat2 ro = mat2( c, -s, s , c );
        pos.xy *= ro;

        //offset (place sur le rayon)
        vec3 o  = vec3( cos( t ) *radius, sin( t ) *radius , 0. );
        
        transformed = pos + o;;

        //normals
        vec3 tNormal = normal;
        tNormal.x += cos( a ) * r;
        tNormal.z += sin( a ) * r;
        tNormal.xy *= ro;
        vNormal = normalize(tNormal * normalMatrix);

        vColor = color;`
      );
      m.vertexShader = vs;

      let fs = m.fragmentShader;
      fs = fs.replace(
        "<common>",
        `<common>
        uniform float time;
        varying vec3 vColor;`
      );
      fs = fs.replace(
        "<color_fragment>",
        `<color_fragment> 
        diffuseColor.rgb = vColor;`
      );
      fs = fs.replace(
        "<normal_fragment_maps>",
        `<normal_fragment_maps>
        normal = vNormal;//normalize( normal * vNormal );`
      );

      m.fragmentShader = fs;
    };
  }
}
