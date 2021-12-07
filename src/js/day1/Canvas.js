export default class Day1 {

static getContext( w,h, addToDOM = true ){

  //taille de l'écran
   w = w || window.innerWidth;
   h = h || window.innerHeight;

  //on crée un canvas
  const canvas = document.createElement("canvas");
  if ( addToDOM === true ) document.body.appendChild(canvas);

  //on assigne la taille au canvas
  canvas.width = w;
  canvas.height = h;

  //on récupère le contexte de dessin
  const ctx = canvas.getContext("2d");
  return ctx
}
  constructor(ctx = null ) {

    if( ctx == null ){
      ctx = Day1.getContext()
    }

    this.ctx = ctx
    this.canvas = ctx.canvas

  }
  setSize( w,h){
    this.canvas.width = w
    this.canvas.height = h
  }

  set opacity( value ){
    this.ctx.globalAlpha = value
  }
  get opacity() {
    return this.ctx.globalAlpha
  }

  circle( x, y, r ){

    if( isNaN(x) ){
      return this.circle( x.x, x.y, y )
    }
    this.ctx.beginPath()
    this.ctx.arc( x, y, r, 0, Math.PI*2  )
    this.ctx.stroke()

  }

  disc(x, y, r) {

    if (isNaN(x)) {
      return this.disc(x.x, x.y, y)
    } 
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.ctx.fill()

  }
  line( x0, y0, x1,y1 ){

    if (isNaN(x0)) {
      return this.line(x0.x, x0.y, y0.x, y0.y)
    }
    this.ctx.beginPath()
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.stroke()
  }



}
