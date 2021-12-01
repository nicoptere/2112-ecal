import Transform from "../geom/Transform";
export default class Sprite extends Transform {
  /**
   *
   * @param {*} options
   * @param {*} options.img the image to display
   * @param {*} options.spritesheet the spritesheet to use
   */
  constructor(position, rotation, scale, options = {}) {
    super(position, rotation, scale);
    Object.assign(this, options);
    if (this.img != undefined) {
      let url = this.img;
      this.img = new Image();
      this.img.src = url;
    }
  }
  render(ctx) {
    ctx.save();
    this.transformContext(ctx);

    if (this.img !== undefined) {
      let iw = this.img.width;
      let ih = this.img.height;
      ctx.drawImage(this.img, 0, 0, iw, ih, -iw / 2, -ih / 2, iw, ih);
    }

    ctx.restore();
  }
}
