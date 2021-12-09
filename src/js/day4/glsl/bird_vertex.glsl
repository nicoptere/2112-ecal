
uniform float time;
varying vec2 vUv;
void main(){
    vUv = uv;
    vec4 mvp = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvp;
}