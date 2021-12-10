import TweenLite from "gsap/gsap-core";

let _stage;
export default class BackgroundColor {
  constructor(stage) {
    _stage = stage;
  }
  static changeColor(dest, duration) {
    let col = "#" + _stage.renderer.getClearColor().getHexString();
    let obj = { color: col };
    TweenLite.to(obj, duration, {
      color: dest,
      onUpdate: () => {
        _stage.setClearColor(obj.color);
      },
    });
  }
}
