import { Vector2 } from "../../utils/geom/Vector";
import { distance, lerp, norm, remap } from "../../utils/geom/geomUtils";
import Graphics from "../../utils/gfx/Graphics";

let g, img;
export default class ImageData {
  constructor() {
    g = new Graphics(); // crée un contexte de dessin

    //on crée une image et on attend qu'elle charge
    img = new Image();
    img.onload = this.onload.bind(this);
    img.src = "assets/oscar.jpg";
  }
  onload() {
    //on définit une taille d'image
    let size = 24;

    //dessine l'image dans un canvas
    g.drawImage(img, 0, 0, size, size);

    // on récupère les valeurs des pixels
    let imageData = this.getPixels(g.ctx, 0, 0, size, size);

    console.log(imageData);
    /*
    images data contient
    width / height : resolution de l'image
    data : un tableau plat contenant les valeurs des pixels sous forme de 4 unsigned ints ( r,g,b,a )
    */
    console.log("size", imageData.width, imageData.height);
    console.log("values", imageData.data.slice(0, 24));

    //trouve la valeur d'un pixel
    console.log(this.rgb(imageData, 10, 10));

    //redessine l'image sous forme de ronds
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        //valeur du pixel
        let rgb = this.rgb(imageData, x, y);
        g.fillStyle = `rgb( ${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        g.disc(100 + x * 20, 100 + y * 20, 10);
      }
    }
  }

  //récupère les valeurs de tous les pixels
  getPixels(ctx, x = 0, y = 0, w = -1, h = -1) {
    w = w == -1 ? ctx.canvas.width : w;
    h = h == -1 ? ctx.canvas.height : h;
    this.imageData = ctx.getImageData(x, y, w, h);
    return this.imageData;
  }

  //récupère la valeur d'un pixel
  rgb(imageData, x, y) {
    //transforme X/Y en position dans le tableau de valeurs
    let id = ~~(~~x + imageData.width * ~~y) * 4;
    let d = imageData.data;
    let r = d[id];
    let g = d[id + 1];
    let b = d[id + 2];
    return [r, g, b];
  }
}
