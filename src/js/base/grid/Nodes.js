import { Vector2 } from "../../utils/geom/Vector";
import { distance, lerp, norm, remap } from "../../utils/geom/geomUtils";
import Graphics from "../../utils/gfx/Graphics";

let g;
export default class Nodes {
  constructor() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let points = [];
    for (let i = 0; i < 500; i++) {
      // crée un point n'importe où à l'écran
      let p = new Vector2(Math.random() * w, Math.random() * h);
      //ajoute le point au tableau
      points.push(p);
    }

    g = new Graphics(); //crée un utilitaire de dessin
    g.dots(points, 5); //dessine les points

    //calcule les lignes
    //choisit une distance maximum
    const maxDist = 50;

    //pour chaque point on vérifie si certains points sont pas trop loin
    points.forEach((a) => {
      points.forEach((b) => {
        if (a === b) return; //c'est le même point donc on s'en fout

        //on calcule la distance entre les 2 points
        let d = distance(a, b);

        //si cette distance est inférieure au rayon souhaité
        if (d < maxDist) {
          //change l'opacité en fonction de la distance
          g.opacity = 1 - d / maxDist;

          //on dessine une ligne
          g.line(a, b);
        }
      });
    });
  }
}
