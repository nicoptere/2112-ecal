export default class Day1 {
  constructor() {
    //taille de l'écran
    let w = window.innerWidth;
    let h = window.innerHeight;

    //on crée un canvas
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    //on assigne la taille au cnavas
    canvas.width = w;
    canvas.height = h;

    //on récupère le contexte de dessin
    const ctx = canvas.getContext("2d");
    ctx.translate(w / 2, h / 2);

    //puis on dessine dedans
    let size = Math.max(w, h);
    let scale = 0.85;
    let rotation = 0.1;

    //on transforme le contexte et on dessine alternativement un rectangle noir et blanc
    let i = 0;
    while (i++ < 20) {
      ctx.fillStyle = i % 2 ? "#000" : "#FFF";
      ctx.fillRect(-size / 2, -size / 2, size, size);

      ctx.scale(scale, scale);
      ctx.rotate(rotation);
    }
  }
}
