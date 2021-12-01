function addFields(el) {
  Object.defineProperty(el, "x", {
    set: function (x) {
      this._x = x;
      this.style.left = x - this.size / 2 + "px";
    },
    get: function () {
      return this._x;
    },
  });
  Object.defineProperty(el, "y", {
    set: function (y) {
      this._y = y;
      this.style.top = y - this.size / 2 + "px";
    },
    get: function () {
      return this._y;
    },
  });
  Object.defineProperty(el, "visible", {
    set: function (v) {
      this._visible = v;
      this.style.visibility = v ? "visible" : "hidden";
      this.style.display = v ? "block" : "none";
    },
    get: function () {
      return this._visible;
    },
  });
  Object.defineProperty(el, "selected", {
    set: function (v) {
      this._selected = v;
      this.style.backgroundColor = v ? "#CCC" : "";
    },
    get: function () {
      return this._selected;
    },
  });
  Object.defineProperty(el, "size", {
    set: function (size) {
      this._size = size;
      this.style.backgroundSize = `${size}px ${size}px`;
      this.style.width = `${size}px`;
      this.style.height = `${size}px`;
    },
    get: function () {
      return this._size;
    },
  });
}

function getButton(type, size = 32) {
  let el = document.createElement("button");
  el.classList.add("uiButton");
  el.style = `
  background-image: url(./assets/ui/${type}.svg);
  background-repeat: no-repeat;`;
  addFields(el);
  el.size = size;
  return el;
}

export const shuffleButton = getButton("shuffle-black-24dp");
export const swapButton = getButton("swap_horiz-24px");
export const playButton = getButton("play_arrow-24px");
export const pauseButton = getButton("pause-24px");
export const redoButton = getButton("redo-24px");
export const undoButton = getButton("undo-24px");
export const resetButton = getButton("restart_alt-24px");
export const closeButton = getButton("close-24px");
export const helpButton = getButton("help_outline-black-24dp");
export const settingsButton = getButton("settings-black-24dp");
export const notAllowedButton = getButton("do_not_touch_black_24dp");
export const touchButton = getButton("touch_app_black_24dp");
export const gestureButton = getButton("gesture_black_24dp");
export const crossHair = getButton("gps_fixed_black_24dp");
export const emptyCrossHair = getButton("gps_not_fixed_black_24dp");
export const geniusButton = getButton("lightbulb_black_24dp");
export const skipNextButton = getButton("skip_next_black_24dp");
export const skipPreviousButton = getButton("skip_previous_black_24dp");
export const navigateNextButton = getButton("navigate_next_black_24dp");
export const navigatePreviousButton = getButton("navigate_before_black_24dp");
