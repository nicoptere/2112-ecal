export default class Runner {
  constructor(world, options = {}) {
    const defaultOptions = {
      fps: 60,
      speed: 1,
    };
    this.options = Object.assign(defaultOptions, options);
    this.world = world;

    this.fps = 0;

    this.runId = null;
    this.render = null;
    this.update = null;
  }
  start(render = false) {
    if (this.runId) {
      return;
    }
    if (render) {
      this.render = render;
    }
    this.last = performance.now();
    this.tick();
  }

  tick() {
    const step = 1 / this.options.fps;
    const slomo = 1 / this.options.speed;
    const slowStep = slomo * step;
    const now = performance.now();
    const delta = (now - this.last) * 0.001;

    let dt = Math.min(1, delta);
    while (dt > slowStep) {
      this.world.step(step);
      dt -= slowStep;
    }
    this.fps = 1 / delta;
    this.last = now;
    this.render();
    // setTimeout(() => {
    //   this.tick();
    // }, 25);
    this.runId = requestAnimationFrame(this.tick.bind(this));
  }

  stop() {
    if (this.runId) {
      cancelAnimationFrame(this.runId);
      this.runId = null;
    }
  }
}
