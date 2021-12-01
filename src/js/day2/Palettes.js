// nices palettes + tool
// https://coolors.co/palettes/trending
export class Palette {
  constructor(values) {
    this.values = values;
    this.rgb = [];
  }
  static fromString(str) {
    let values = str
      .toUpperCase()
      .replace(/[^0-9A-F]/gm, "|")
      .split("|")
      .map((v) => "#" + v);
    return new Palette(values);
  }
  split(str) {
    let e = str.replace("#", "").split("");
    let i = 0;
    return [
      parseInt(e[i++] + e[i++], 16),
      parseInt(e[i++] + e[i++], 16),
      parseInt(e[i++] + e[i++], 16),
    ];
  }
  asRGB() {
    this.rgb = this.values.map((v) => {
      return this.split(v);
    });
    return this.rgb;
  }
}
export const vivid0 = new Palette([
  "#a79ad1",
  "#5b5f97",
  "#ffc145",
  "#00b884",
  "#ff6b6c",
  "#ff3c38",
  "#000f24",
]);
export const vivid1 = new Palette([
  "#011627",
  "#f71735",
  "#41ead4",
  "#1d5ae7",
  "#fdfffc",
]);
export const vivid2 = new Palette([
  "#ad343e",
  "#474747",
  "#f2af29",
  "#000000",
  "#e0e0ce",
]);
