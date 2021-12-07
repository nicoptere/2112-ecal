import {
  Color,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let sce, cam, ren, cc;
let zero = new Vector3();
let size = new Vector2();
export default class Stage {
  constructor(w, h) {
    sce = new Scene();
    cam = new PerspectiveCamera(60, w / h, 0.001, 10000);

    ren = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    ren.setClearColor(new Color(1, 1, 1));
    cc = new OrbitControls(cam, ren.domElement);
    cc.enabled = true;
    cam.position.z = -50;
    cam.lookAt(zero);

    this.domElement = ren.domElement;
    this.resize(w, h);

    this.camera = cam;
    this.renderer = ren;
    this.scene = sce;
    this.controls = cc;

    window.camera = cam;
    window.target = cc.target;
  }

  resize(w, h) {
    ren.setSize(w, h);
    size.x = w;
    size.y = h;
    ren.setPixelRatio(window.devicePixelRatio);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }

  render() {
    if (cc && cc.enabled) cc.update();
    ren.render(sce, cam);
  }

  add(obj) {
    sce.add(obj);
  }

  static add(obj) {
    sce.add(obj);
  }
  get size() {
    return size;
  }
  static get size() {
    return size;
  }
}
