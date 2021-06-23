export default `#version 300 es
precision highp float;

uniform float u_alpha;

in vec3 v_position;

out vec4 color;

void main() {
  if (u_alpha == 0.0F) discard;

  color = vec4((v_position + vec3(1.0F, 1.0F, 1.0F)) / 2.0F, u_alpha);
}
`;
