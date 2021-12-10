import TweenLite from "gsap/gsap-core";
import { Bounce, Back } from "gsap";

let RAD = Math.PI / 180;
export default class Animator {
  constructor() {}

  static init(object) {
    this.saveValues(object);
    this.close(object, null, 0);
  }

  static getChildren(object, recursive = false) {
    let children = [];
    if (recursive == true) {
      object.traverse((o) => {
        children.push(o);
      });
    } else {
      children = object.children.concat();
    }
    return children;
  }

  static saveValues(object) {
    let children = this.getChildren(object);
    children.forEach((o, i) => {
      o.pos = o.position.clone();
      o.rot = o.rotation.clone();
      o.sca = o.scale.clone();
    });
  }

  static close(object, callback, duration = 0) {
    let children = this.getChildren(object);
    children.forEach((o, i) => {
      let a = (i / children.length) * Math.PI * 2;
      let d = o.position;
      TweenLite.to(o.position, 0, {
        x: Math.cos(a) * 10,
        y: Math.sin(a) * 10,
        z: d.z,
      });
      TweenLite.to(o.rotation, 0, {
        x: (Math.random() - 0.5) * RAD * 90,
        y: (Math.random() - 0.5) * RAD * 90,
        z: (Math.random() - 0.5) * RAD * 90,
      });
    });
  }

  static open(object, callback, duration = 1) {
    let children = this.getChildren(object);
    children.forEach((o, i) => {
      let d = i / children.length;
      TweenLite.to(o.position, 1.5, {
        x: o.pos.x,
        y: o.pos.y,
        z: o.pos.z,
        delay: d,
        ease: Bounce.easeOut,
      });
      this.opacity(o, 1, 0.75);
      TweenLite.to(o.rotation, 0.75, {
        x: o.rot.x,
        y: o.rot.y,
        z: o.rot.z,
        delay: d,
        ease: Bounce.easeOut,
      });
      TweenLite.to(o.scale, 0.75, {
        x: o.sca.x,
        y: o.sca.y,
        z: o.sca.z,
        delay: d,
        ease: Bounce.easeOut,
      });
    });
    setTimeout(() => {
      if (callback != null) callback();
    }, 1000 * duration + 1000);
  }

  static boom(object, callback, duration = 1, radius = 10) {
    // this.saveValues(object);
    let children = this.getChildren(object);
    children.forEach((o) => {
      TweenLite.to(o.position, duration, {
        x: o.position.x + (Math.random() - 0.5) * radius * 2,
        y: o.position.y + (Math.random() - 0.5) * radius * 2,
        z: o.position.z + (Math.random() - 0.5) * radius * 2,
      });
      TweenLite.to(o.rotation, duration * 0.5, {
        x: o.rotation.x + (Math.random() - 0.5) * RAD * 180,
        y: o.rotation.y + (Math.random() - 0.5) * RAD * 180,
        z: o.rotation.z + (Math.random() - 0.5) * RAD * 180,
      });
    });
    setTimeout(() => {
      if (callback != null) callback();
    }, 1000 * duration + 100);
  }

  static fold(object, callback, duration = 1) {
    let children = this.getChildren(object);
    children.sort(() => {
      return Math.random() > 0.5 ? -1 : 1;
    });
    children.forEach((o, i) => {
      let d = i / children.length;
      let r = Math.sign(Math.random() - 0.5);
      let rx = r == -1 ? 1 : 0;
      let ry = r == -1 ? 0 : 1;
      this.opacity(o, 0, duration, d);
      TweenLite.to(o.rotation, duration, {
        x: rx * RAD * 90,
        y: ry * RAD * 90,
        delay: d,
      });
    });
    setTimeout(() => {
      if (callback != null) callback();
    }, 1000 * duration + 100);
  }

  static opacity(object, value, duration, delay = 0) {
    if (object.material != null) {
      TweenLite.to(object.material, duration, {
        opacity: value,
        delay: delay,
      });
    } else {
      TweenLite.to(object, duration, {
        opacity: value,
        delay: delay,
      });
    }
  }
}

// TODO centralise calls
//   static call(object, callback, position, rotation, scale) {
//     object.children.forEach((o, i) => {
//       o.pos = o.position.clone();
//       o.rot = o.rotation.clone();
//       o.sca = o.scale.clone();
//       let t = (i / object.children.length) * 0.25;
//       TweenLite.to(o.position, 1.25, position(t, o));
//       TweenLite.to(o.rotation, 0.75, rotation(t, o));
//       TweenLite.to(o.scale, 0.75, scale(t, o));
//     });
//     setTimeout(() => {
//       if( callback != null )callback();
//     }, 2000);
//   }
