import { vec3 } from "gl-matrix";

import { GLSLShader, GLSLProgram, GLSLCamera, GLSLCube } from "../lib/glsl";

import { hexToRGBA, WHITE, RGBA } from "../helpers/color";

import CUBE_VERT from "../shaders/cube.vert";
import CUBE_FRAG from "../shaders/cube.frag";


/** Canvas state */
export interface CanvasState {
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
export type CanvasAction = {
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
  readonly type: `RESET_CAMERA`
} | {
  readonly type: `TOGGLE_PROJECTION`
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
const render = (state: CanvasState): CanvasState => {
  const { gl, program, camera, cube } = state;

  // Reset context
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set uniforms
  program.use();
  camera.bind(gl, program);

  // Draw cube
  cube.draw();

  // Return state
  return {
    container: state.container,
    canvas: state.canvas,
    gl,
    program,
    camera,
    cube,
    background: state.background,
    errors: state.errors
  };
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
const initialize = (state: CanvasState, container: HTMLDivElement, canvas: HTMLCanvasElement, background?: string): CanvasState => {
  // Error handler function
  const errors: string[] = [];
  const onerror = (error: string) => { errors.push(error); };

  // Initialize and setup context
  const gl = canvas.getContext(`webgl2`, { alpha: false }) as WebGL2RenderingContext;

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Background color
  const bg = (background && hexToRGBA(background)) || state.background;
  gl.clearColor(bg[0], bg[1], bg[2], bg[3]);

  // Image program
  const vert = new GLSLShader(gl, gl.VERTEX_SHADER, CUBE_VERT, onerror);
  const frag = new GLSLShader(gl, gl.FRAGMENT_SHADER, CUBE_FRAG, onerror);
  const program = new GLSLProgram(gl, vert, frag, onerror);
  program.deleteShaders();

  // Cube
  const cube = new GLSLCube(gl, onerror);

  // Update camera resolution
  const { camera } = state;
  camera.resolution = { width: container.offsetWidth, height: container.offsetHeight };
  camera.position = [ 0, 0, -7 ];
  camera.rotate([ -200, -200 ], [ 0, 0, 0 ]);

  camera.defaultView = {
    position: camera.position,
    front: camera.front,
    right: camera.right,
    up: camera.up,
    pitch: camera.pitch,
    yaw: camera.yaw
  };

  // Render
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
const resize = (state: CanvasState): CanvasState => {
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
 * @returns Next state
 */
const setBackground = (state: CanvasState, bg: string): CanvasState => {
  const { gl } = state;

  // Parse and update background color
  const background = hexToRGBA(bg) || WHITE;

  gl.clearColor(background[0], background[1], background[2], background[3]);

  return render({
    container: state.container,
    canvas: state.canvas,
    gl: state.gl,
    program: state.program,
    camera: state.camera,
    cube: state.cube,
    background,
    errors: state.errors
  });
};


/**
 * Release all resources.
 *
 * @param state Current state
 * @returns Next state
 */
const cleanUp = (state: CanvasState): CanvasState => {
  const { program, cube } = state;

  program.delete();
  cube.delete();

  return render(state);
};


/** Initial canvas state */
export const initialCanvas: CanvasState = {
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
export const canvasReducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  const { camera } = state;


  switch (action.type) {
    case `INITIALIZE`: return initialize(state, action.container, action.canvas, action.background);
    case `RESIZE`: return resize(state);

    case `SET_BACKGROUND`: return setBackground(state, action.background);


    case `RESET_CAMERA`:
      camera.reset();
      return render(state);

    case `TOGGLE_PROJECTION`:
      camera.projection = camera.projection === `perspective` ? `orthogonal` : `perspective`;
      return render(state);

    case `ROTATE`:
      camera.rotate([ action.dx, action.dy ], action.center);
      return render(state);

    case `ZOOM_IN`:
      camera.zoomIn();
      return render(state);

    case `ZOOM_OUT`:
      camera.zoomOut();
      return render(state);

    case `SCALE`:
      camera.fov = action.fov;
      return render(state);


    case `CLOSE_ERRORS`: return { ...state, errors: [] };
    case `CLEAN_UP`: return cleanUp(state);
  }
};
