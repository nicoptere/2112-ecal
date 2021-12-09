import { AmbientLight, DirectionalLight, PointLight, Vector3 } from "three";

export default class Lights {
  constructor(stage) {
    let d0 = new DirectionalLight(0xcccccc, 0.85, 500);
    d0.position.x = 0;
    d0.position.y = 25;
    d0.position.z = 0;
    d0.lookAt(new Vector3());
    stage.add(d0);

    let a = new AmbientLight(0xffffff, 0.75);
    stage.add(a);

    let l1 = new PointLight(0xffffff, 0.5, 500);
    l1.position.y = 50;
    l1.position.z = -100;
    stage.add(l1);
    this.l1 = l1;

    let l2 = new PointLight(0xffffff, 0.5, 500);
    l2.position.y = 50;
    l2.position.z = 100;
    stage.add(l2);
    this.l2 = l2;
  }
  update() {}
}
