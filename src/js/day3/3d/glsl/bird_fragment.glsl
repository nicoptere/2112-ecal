
uniform sampler2D map;
uniform float time;
varying vec2 vUv;
void main(){
    gl_FragColor = texture2D( map, vUv );
}