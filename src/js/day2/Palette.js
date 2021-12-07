export default class Palette {
  constructor(values) {
    this.values = values;
  }

  get color() {
    return this.values[0];
  }

  nextColor() {
    this.values.push(this.values.shift());
    return this.color;
  }

  static fromString(str) {
    let values = str.split("-");

    values = values.map(function (v) {
      return "#" + v;
    });

    return new Palette(values);
  }
}
