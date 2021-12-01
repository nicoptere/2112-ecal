import { Vector2 } from "../../utils/geom/Vector";
import { distance, lerp, norm, remap } from "../../utils/geom/geomUtils";
import Graphics from "../../utils/gfx/Graphics";

let g, img;
export default class Binning {
  constructor() {
    g = new Graphics();
    img = new Image();
    img.onload = this.onload.bind(this);
    img.src = "assets/oscar.jpg";
  }
  onload() {
    let size = 64;
    const upscale = 1024 / size;
    g.ctx.filter = "brightness(1.5)";
    g.drawImage(img, 0, 0, size, size);
    g.ctx.filter = "";
    g.getPixels(0, 0, size, size);

    //on va stocker les points dans des boites
    let bins = [];
    const binSize = new Vector2(10, 10);

    // la taille en pixels d'une boite en pixels upscalés c'est
    let binWidth = (size * upscale) / binSize.x;
    let binHeight = (size * upscale) / binSize.y;

    //zou! on collecte des boîtes

    for (let x = 0; x < binSize.x; x++) {
      let tmp = [];
      for (let y = 0; y < binSize.y; y++) {
        tmp.push([]);
        //on peut dessiner les boite, pour être sûr
        g.strokeStyle = `rgb( 
            ${~~((x / binSize.x) * 0xff)}, 
            ${~~((y / binSize.y) * 0xff)}, 0 )`;
        g.ctx.strokeRect(x * binWidth, y * binHeight, binWidth, binHeight);
      }
      bins.push(tmp);
    }
    //on itère en X / Y sur l'image
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

          // on le colle dans une boite
          //pour ça on arrondit les coordonnées normalisées multipliée par la taille des boites
          let bx = ~~((x / size) * binSize.x);
          let by = ~~((y / size) * binSize.y);
          bins[bx][by].push(p);
        }
      }
    }

    //dessine les points
    g.strokeStyle = "#000";
    g.dots(bins.flat(2), 3); // .flat( depth ) ça aplatit un tableau
    //dessine les points d'une boite
    // g.dots(bins[6][6], 15);
    // pour se donner une idée
    // console.log(bins);

    // ... ok et ?
    //puis comme avant, on va relier des points
    // maintenant on peut appliquer nos tests de disstances sur des sous ensembles
    // ça va un poil plus vite
    const maxDist = 5 * upscale;
    /*
    console.time("r");
    g.ctx.beginPath();
    bins.forEach((col, x, cols) => {
      col.forEach((cell, y, rows) => {
        cell.forEach((a) => {
          //ici on accède au point
          //on peut créer les lignes à l'intérieur de la cellule
          cell.forEach((b) => {
            if (a == b) return;
            this.createLine(maxDist, a, b);
          });
        });
      });
    });
    g.opacity = 0.2;
    g.ctx.stroke();
    console.timeEnd("r");
    // return;

    //*/
    // going deeper:
    //on va aussi calculer les connexions aux cellules voisines
    console.time("r");
    let acc = 0;
    g.ctx.beginPath();
    bins.forEach((col, x) => {
      col.forEach((cell, y) => {
        const neighbours = this.getAdjacentCells(bins, x, y).flat();
        cell.forEach((a) => {
          //ici on accède au point
          //on peut créer les lignes à l'intérieur de la cellule
          neighbours.forEach((b) => {
            if (a == b) return;
            this.createLine(maxDist, a, b);
            acc++;
          });
        });
      });
    });
    g.opacity = 0.2;
    g.ctx.stroke();
    console.timeEnd("r");
    console.log(bins.flat(2).length ** 2, acc);
  }

  createLine(maxDist, a, b) {
    let d = distance(a, b);
    if (d < maxDist) {
      g.ctx.moveTo(a.x, a.y);
      g.ctx.lineTo(b.x, b.y);
    }
  }

  getAdjacentCells(array, x, y, connexity = 8) {
    let tmp = [];
    let w = array[0].length;
    let h = array.length;
    if (y - 1 >= 0) tmp.push(array[x][y - 1]);
    if (x + 1 < w) tmp.push(array[x + 1][y]);
    if (y + 1 < h) tmp.push(array[x][y + 1]);
    if (x - 1 >= 0) tmp.push(array[x - 1][y]);
    if (connexity == 8) {
      if (x - 1 >= 0 && y - 1 >= 0) tmp.push(array[x - 1][y - 1]);
      if (x + 1 < w && y - 1 >= 0) tmp.push(array[x + 1][y - 1]);
      if (x + 1 < w && y + 1 < h) tmp.push(array[x + 1][y + 1]);
      if (x - 1 >= 0 && y + 1 < h) tmp.push(array[x - 1][y + 1]);
    }
    return tmp;
  }
}
