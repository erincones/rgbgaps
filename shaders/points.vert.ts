export default `#version 300 es
layout (location = 0) in vec3 a_position;

uniform float u_size;
uniform vec3 u_color;
uniform vec3 u_position;
uniform mat4 u_proj_view;

void main() {
  gl_Position = u_proj_view * vec4(a_position * u_size + u_position, 1.0F);
}
`;
