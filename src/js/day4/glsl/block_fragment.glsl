
uniform vec3 color;
uniform float time;
uniform float opacity;
void main(){
    gl_FragColor = vec4( color, opacity);
}