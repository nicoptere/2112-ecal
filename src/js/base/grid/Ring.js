import { Vector2 } from "../../utils/geom/Vector";
import { distance, lerp, norm, remap } from "../../utils/geom/geomUtils";
import Graphics from "../../utils/gfx/Graphics";

let g;
export default class Ring {
  constructor() {
    g = new Graphics();

    const w = window.innerWidth;
    const h = window.innerHeight;
    let points = [];

    //5 cercles concentriques
    const d = Math.min(w, h) / 2;

    // rayon intérieur
    let inner_radius = d / 3;

    // rayon extérieur
    let outer_radius = (d / 3) * 2;

    for (let i = 0; i < 5; i++) {
      //calcule le rayon courant
      const radius = remap(i, 0, 5, inner_radius, outer_radius);

      //combien de points par cercle ?
      const count = 50 + Math.random() * 100;
      for (let j = 0; j < count; j++) {
        //calcule un angle pour chaque point

        //angle régulier
        let angle = remap(j, 0, count, 0, Math.PI * 2);

        //angle aléatoire
        // angle = Math.random() * Math.PI * 2;

        let r = radius;
        //rayon aléatoire
        // r = radius + (Math.random() - 0.5) * 10;

        //place un point sur le cercle
        let p = new Vector2(
          w / 2 + Math.cos(angle) * r,
          h / 2 + Math.sin(angle) * r
        );

        //ajoute le point au tableau
        points.push(p);
      }
    }

    //dessine les points
    g.dots(points, 5);

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
