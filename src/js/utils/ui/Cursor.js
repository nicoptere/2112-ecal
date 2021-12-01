let type;
export default class Cursor {
  constructor(domeElement) {
    domeElement.addEventListener("mousemove", (e) => {
      let x = e.clientX;
      let y = e.clientY;
      domeElement.style.cursor = "default";
    });
  }
}
