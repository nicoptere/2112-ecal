export default class Binning {
  constructor(cellSize = 50) {
    this.cellSize = cellSize;
    this.items = [];
  }

  resize(w, h) {
    let cellSize = this.cellSize;
    this.w = ~~(w / cellSize);
    this.h = ~~(h / cellSize);
    this.reset();
  }

  reset() {
    // console.log("reset");
    this.items = [];
    for (let i = 0; i < this.w * this.h; i++) {
      this.items.push([]);
    }
  }

  evaluate(p) {
    let cellSize = this.cellSize;
    if (p.id != undefined) {
      let arr = this.items[p.id];
      if (arr !== undefined) {
        arr.splice(arr.indexOf(p), 1);
      }
    }
    p.cx = ~~(p.x / cellSize);
    p.cy = ~~(p.y / cellSize);
    p.id = ~~(p.x / cellSize) + ~~(p.y / cellSize) * this.w;
    if (this.items[p.id] !== undefined) {
      this.items[p.id].push(p);
    }
  }

  getAdjacency(id, size = 2, ctx = null) {
    let cellSize = this.cellSize;
    let tmp = [];
    let x = id % this.w;
    let y = ~~(id / this.w);
    if (ctx !== null) ctx.globalAlpha = 0.25;
    for (let i = Math.max(0, x - size); i <= Math.min(this.w, x + size); i++) {
      for (
        let j = Math.max(0, y - size);
        j <= Math.min(this.h, y + size);
        j++
      ) {
        let nid = i + j * this.w;

        tmp = tmp.concat(this.items[nid]);

        if (ctx !== null)
          ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
    if (ctx !== null) ctx.globalAlpha = 1;
    return tmp;
  }

  render(ctx) {
    let cellSize = this.cellSize;
    ctx.globalAlpha = 0.125;
    for (let j = 0; j < this.h; j++) {
      for (let i = 0; i < this.w; i++) {
        ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }

    ctx.globalAlpha = 0.5;
    for (let i = 0; i < this.w * this.h; i++) {
      if (this.items[i].length > 0) {
        this.items[i].forEach((p) => {
          ctx.strokeRect(p.cx * cellSize, p.cy * cellSize, cellSize, cellSize);
        });
      }
    }
    ctx.globalAlpha = 1;
  }
}
