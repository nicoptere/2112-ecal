import { CONFIG } from "../utils/Config";
import Moebius from "../moebius/Moebius";
import Background from "./Background";
import Lights from "./Lights";
let model, background, lights;
export default class Scene {
  constructor(stage) {
    lights = new Lights(stage);

    background = new Background(stage);

    model = new Moebius(CONFIG);
    stage.add(model);
  }

  update() {
    if (model) model.update();
    if (lights) lights.update();
  }
}
