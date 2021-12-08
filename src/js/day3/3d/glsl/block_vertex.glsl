
uniform float time;
void main(){
    vec4 mvp = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvp;
}