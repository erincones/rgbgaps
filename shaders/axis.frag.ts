export default `#version 300 es
precision highp float;

uniform vec3 u_color;
uniform float u_alpha;

out vec4 color;

void main() {
  color = vec4(u_color, u_alpha);
}
`;
