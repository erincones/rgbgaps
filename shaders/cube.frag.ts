export default `#version 300 es
precision highp float;

in vec3 v_position;

out vec4 color;

void main() {
  color = vec4((v_position + vec3(1.0F, 1.0F, 1.0F)) / 2.0F, 1.0F);
}
`;
