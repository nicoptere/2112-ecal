import {
  BufferAttribute,
  IcosahedronGeometry,
  IcosahedronBufferGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
} from "three";

export default class MoebiusGeometry extends InstancedBufferGeometry {
  constructor(config) {
    //create blueprints
    super();
    let src = new IcosahedronBufferGeometry(0.5, config.sphereDetail);
    this.setAttribute(
      "position",
      new BufferAttribute(src.getAttribute("position").array, 3)
    );
    this.setAttribute(
      "uv",
      new BufferAttribute(src.getAttribute("uv").array, 2)
    );
    this.setAttribute(
      "normal",
      new BufferAttribute(src.getAttribute("normal").array, 3)
    );
    this.setIndex(src.getIndex());
    this.reset(config);
  }

  reset(config) {
    let sw = config.section.width;
    let sh = config.section.height;
    let perUint = Math.max(config.section.countPerSide - 1, 1);
    let swStep = sw / perUint;
    let shStep = sh / perUint;

    let pos = [];
    let col = [];
    let uid = 0;
    for (let i = 0; i < config.count - 1; i++) {
      let z = i / (config.count - 1);
      for (let x = 0; x <= sw; x += swStep) {
        for (let y = 0; y <= sh; y += shStep) {
          //keep onlty outer frame if hollow
          if (config.hollow && !(x == 0 || x == sw || y == 0 || y == sh))
            continue;

          //position en X Y  sur le carré
          pos.push(x - sw / 2, y - sh / 2);

          //position normalisée le long du cercle ( 0 -> 1 )
          pos.push(z - 0.5);

          //taille des billes
          pos.push(config.size.default);

          //aléatoire: non utilisé
          // pos.push(lerp(Math.random(), config.size.min, config.size.max));

          //couleur: utilise la fonction définie dans config ou met du blanc
          if (config.color === true) {
            config.colorRule(i, uid, col);
          } else {
            col.push(1, 1, 1);
          }
          uid++;
        }
      }
    }

    this.setAttribute(
      "section",
      new InstancedBufferAttribute(new Float32Array(pos), 4)
    );
    this.setAttribute(
      "color",
      new InstancedBufferAttribute(new Float32Array(col), 3)
    );
    this.needsUpdate = true;
  }
}
