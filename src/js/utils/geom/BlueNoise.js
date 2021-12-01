import seeds from "./bn_seeds.json";
export default class BlueNoise {
  constructor() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#09C";

    let s = 8;
    let BN = seeds[s.toString()];
    let A = BN[~~(Math.random() * BN.length)];
    let B = BN[~~(Math.random() * BN.length)];
    let s2 = s * s;
    let up = 256;
    let id = 0;
    A.forEach((a) => {
      B.forEach((b) => {
        let ix = id % s;
        let iy = ~~(id / s);
        let x = (A[iy] + ix * s) / s2;
        let y = (B[ix] + iy * s) / s2;
        ctx.fillRect(x * up, y * up, 4, 4);
        id++;
      });
    });

    // for( let i = 0; i < w; i += up ){
    //     for( let j = 0; j < h; j += up ){
    //     let ix = id % s;
    //     let iy = ~~(id / s);

    //     let x = (A[iy] + ix * s) / s2;
    //     let y = (B[ix] + iy * s) / s2;

    //     ctx.fillRect(x * up, y * up, 4, 4);

    //   }
    // }

    // ctx.globalAlpha = 0.5;
    // ctx.drawImage(canvas, 0, 0, up, up, up, 0, up, up);
    // ctx.drawImage(canvas, 0, 0, up * 2, up, 0, up, up * 2, up);
    // ctx.drawImage(canvas, 0, 0, up * 2, up * 2, up * 2, 0, up * 2, up * 2);
  }
}
