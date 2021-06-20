export default `#version 300 es
layout (location = 0) in vec3 a_position;

uniform mat4 u_view;
uniform mat4 u_proj;

out vec3 v_position;

void main() {
  v_position = a_position;
  gl_Position = u_proj * u_view * vec4(a_position, 1.0F);
}
`;
