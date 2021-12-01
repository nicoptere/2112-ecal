import { Vector2 } from "../../utils/geom/Vector";
import { distance, lerp, norm, remap } from "../../utils/geom/geomUtils";
import Graphics from "../../utils/gfx/Graphics";

let g, img, ctx;
export default class Portrait {
  constructor() {
    g = new Graphics();
    ctx = g.ctx;
    //on crée une image et on attend qu'elle charge
    img = new Image();
    img.onload = this.onload.bind(this);
    img.src = "assets/oscar.jpg";
  }
  onload() {
    //on définit une taille d'image
    let size = 64; // on reste calme par ici (< 100)

    //cosmétique (augmente la luminosité)
    ctx.filter = "brightness(1.5)";
    g.drawImage(img, 0, 0, size, size);
    ctx.filter = "";
    g.getPixels(0, 0, size, size);

    //comme size doit rester petit, on redessinera les point en plus grand
    const upscale = 1024 / size; // dit par combien on mutiplie la petite image

    //hop on récolte les valeurs des pixels
    let points = [];
    //on itère en X / Y
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // ici on sample l'image au point X/Y
        // on calcule la valeur de gris (luminance ou luma)
        let l = g.luma(x, y);

        //si le point est plutôt sombre ( luma < 35% )
        if (l < 0.35) {
          // on crée un point
          let p = new Vector2(x, y);
          //on l'upscale pour mieux voir
          p.multiplyScalar(upscale);
          // on le garde
          points.push(p);
        }
      }
    }
    //dessine les points
    g.dots(points, 3);

    //puis comme avant, on va relier des points
    const maxDist = 5 * upscale;
    console.time("r");
    g.ctx.beginPath();
    for (let x = 0; x < points.length; x++) {
      let a = points[x];
      for (let y = x + 1; y < points.length; y++) {
        let b = points[y];
        if (a == b) continue; //on s'en fout
        let d = distance(a, b);
        if (d < maxDist) {
          //on dessine une ligne
          g.ctx.moveTo(a.x, a.y);
          g.ctx.lineTo(b.x, b.y);
        }
      }
    }
    g.opacity = 0.2;
    g.ctx.stroke();
    console.timeEnd("r");

    //en augmantant la taille de l'image, ce truc va tuer le CPU
  }
}
