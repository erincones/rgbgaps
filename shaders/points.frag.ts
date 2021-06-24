export default `#version 300 es
precision highp float;

uniform float u_rgb;
uniform float u_alpha;
uniform vec3 u_color;


out vec4 color;

void main() {
  color = vec4(u_rgb * u_color, u_alpha);
}
`;
