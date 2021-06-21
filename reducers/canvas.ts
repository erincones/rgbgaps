import { vec3 } from "gl-matrix";

import { GLSLShader, GLSLProgram, GLSLCamera, GLSLCube } from "../lib/glsl";

import { hexToRGBA, WHITE, RGBA } from "../helpers/color";

import CUBE_VERT from "../shaders/cube.vert";
import CUBE_FRAG from "../shaders/cube.frag";


/** Canvas state */
interface State {
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  readonly program: GLSLProgram;
  readonly camera: GLSLCamera;
  readonly cube: GLSLCube;

  readonly background: RGBA;

  readonly errors: ReadonlyArray<string>;
}

/** Canvas action */
type Action = {
  readonly type: `INITIALIZE`;
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly background?: string;
} | {
  readonly type: `RESIZE`;
} | {
  readonly type: `SET_BACKGROUND`;
  readonly background: string;
} | {
  readonly type: `ROTATE`;
  readonly dx: number;
  readonly dy: number;
  readonly center?: vec3;
} | {
  readonly type: `SCALE`;
  readonly fov: number;
} | {
  readonly type: `ZOOM_IN`;
} | {
  readonly type: `ZOOM_OUT`;
} | {
  readonly type: `CLOSE_ERRORS`;
} | {
  readonly type: `CLEAN_UP`;
};



/**
 * Render the image.
 *
 * @param state Current state
 * @returns Next state
 */
const render = (state: State): State => {
  const { gl, program, camera, cube } = state;

  // Reset context
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set uniforms
  program.use();
  camera.bind(gl, program);

  // Draw cube
  cube.draw();

  // Return state
  return state;
};


/**
 * Initialize canvas state.
 *
 * @param state Current state
 * @param container Canvas container
 * @param canvas Canvas element
 * @param background Background color
 * @returns Next state
 */
const initialize = (state: State, container: HTMLDivElement, canvas: HTMLCanvasElement, background?: string): State => {
  // Error handler function
  const errors: string[] = [];
  const onerror = (error: string) => { errors.push(error); };

  // Initialize and setup context
  const gl = canvas.getContext(`webgl2`, { alpha: false }) as WebGL2RenderingContext;

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);

  // Image program
  const vert = new GLSLShader(gl, gl.VERTEX_SHADER, CUBE_VERT, onerror);
  const frag = new GLSLShader(gl, gl.FRAGMENT_SHADER, CUBE_FRAG, onerror);
  const program = new GLSLProgram(gl, vert, frag, onerror);
  program.deleteShaders();

  // Update camera resolution
  const { camera } = state;
  camera.resolution = { width: container.offsetWidth, height: container.offsetHeight };

  // Cube
  const cube = new GLSLCube(gl, onerror);

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  return render({
    container,
    canvas,
    gl,
    program,
    camera,
    cube,
    background: (background && hexToRGBA(background)) || state.background,
    errors
  });
};

/**
 * Resize the container.
 *
 * @param state Current state
 * @returns Next state
 */
const resize = (state: State): State => {
  const { gl, container, canvas, camera } = state;

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Update camera
  camera.resolution = { width: container.offsetWidth, height: container.offsetHeight };

  return render(state);
};


/**
 * Update the background color.
 *
 * @param state Current state
 * @param bg Background color
 * @param g0 First grid color
 * @param g1 Second grid color
 */
const setBackground = (state: State, bg: string): State => {
  const { gl } = state;

  // Parse and update background color
  const background = hexToRGBA(bg) || WHITE;

  gl.clearColor(background[0], background[1], background[2], background[3]);

  return render({ ...state, background });
};


/**
 * Rotate the camera.
 *
 * @param state Current state
 * @param dx Horizontal displacement
 * @param dy Vertical displacement
 * @param center Reference point
 * @returns Next state
 */
const rotate = (state: State, dx: number, dy: number, center?: vec3): State => {
  state.camera.rotate([ dx, dy ], center);
  return render(state);
};

/**
 * Apply zoom.
 *
 * @param state Current state
 * @param fov New field of view
 * @returns Next state
 */
const zoom = (state: State, fov: number | `in` | `out`): State => {
  const { camera } = state;

  switch (fov) {
    case `in`: camera.zoomIn(); break;
    case `out`: camera.zoomOut(); break;
    default: camera.fov = fov;
  }

  return render(state);
};


/**
 * Release all resources.
 *
 * @param state Current state
 * @returns Next state
 */
const cleanUp = (state: State): State => {
  const { program, cube } = state;

  program.delete();
  cube.delete();

  return render(state);
};


/** Initial canvas state */
export const initialCanvas: State = {
  container: null as never,
  canvas: null as never,
  gl: null as never,
  program: null as never,
  camera: new GLSLCamera(),
  cube: null as never,
  background: WHITE,
  errors: []
};


/**
 * Canvas reducer
 *
 * @param state Current state
 * @param action Action
 * @returns Next state
 */
export const canvasReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case `INITIALIZE`: return initialize(state, action.container, action.canvas, action.background);
    case `RESIZE`: return resize(state);

    case `SET_BACKGROUND`: return setBackground(state, action.background);

    case `ROTATE`: return rotate(state, action.dx, action.dy, action.center);

    case `ZOOM_IN`: return zoom(state, `in`);
    case `ZOOM_OUT`: return zoom(state, `out`);
    case `SCALE`: return zoom(state, action.fov);

    case `CLOSE_ERRORS`: return { ...state, errors: [] };
    case `CLEAN_UP`: return cleanUp(state);
  }
};
