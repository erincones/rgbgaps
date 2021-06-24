export default `#version 300 es
precision highp float;

uniform vec3 u_color;
uniform float u_rgb;
uniform float u_alpha;
uniform float u_gap;
uniform int u_axis;

in vec3 v_position;

out vec4 color;

void main() {
  vec3 pos = (v_position + vec3(1.0F, 1.0F, 1.0F)) / 2.0F;

  if ((u_gap > 0.0F) && (mod(pos[u_axis] * 256.0F, u_gap) > u_gap / 2.0F)) discard;

  color = vec4(u_rgb * pos, u_alpha);
}
`;
