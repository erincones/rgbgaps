import { GLSLShader, GLSLProgram, GLSLTexture2D, GLSLPlane } from "../lib/glsl";

import { hexToRGBA, WHITE, RGBA } from "../helpers/color";

import CUBE_VERT from "../shaders/cube.vert";
import CUBE_FRAG from "../shaders/cube.frag";


/** Canvas state */
interface State {
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  readonly program: GLSLProgram;
  readonly texture: GLSLTexture2D;
  readonly plane: GLSLPlane;

  readonly background: RGBA;

  readonly x: number;
  readonly y: number;
  readonly scale: number;

  readonly errors: ReadonlyArray<string>;
}

/** Canvas action */
type Action = {
  readonly type: `INITIALIZE`;
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
} | {
  readonly type: `RESIZE`;
} | {
  readonly type: `SET_BACKGROUND`;
  readonly background: string;
} | {
  readonly type: `TRANSLATE`;
  readonly dx: number;
  readonly dy: number;
} | {
  readonly type: `SCALE`;
  readonly scale: number;
  readonly x?: number;
  readonly y?: number;
} | {
  readonly type: `ZOOM_IN`;
  readonly x?: number;
  readonly y?: number;
} | {
  readonly type: `ZOOM_OUT`;
  readonly x?: number;
  readonly y?: number;
} | {
  readonly type: `CLOSE_ERRORS`;
} | {
  readonly type: `CLEAN_UP`;
};


/** Minimum scale */
export const SCALE_MIN = 1;

/** Maximum scale */
export const SCALE_MAX = 20;

/** Scale factor */
export const SCALE_FACTOR = 1.25;


/**
 * Render the image.
 *
 * @param state Current state
 * @returns Next state
 */
const render = (state: State): State => {
  const { gl, container, program, plane, scale } = state;

  // Reset context
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set uniforms
  program.use();
  gl.uniform2f(program.getLocation(`u_canvas`), container.offsetWidth, container.offsetHeight);
  gl.uniform1f(program.getLocation(`u_scale`), scale);

  // Draw plane
  plane.draw();

  // Return state
  return state;
};


/**
 * Initialize canvas state.
 *
 * @param container Canvas container
 * @param canvas Canvas element
 * @param background Background color
 * @param grid0 First grid color
 * @param grid1 Second grid color
 * @returns Next state
 */
const initialize = (container: HTMLDivElement, canvas: HTMLCanvasElement): State => {
  // Error handler function
  const errors: string[] = [];
  const onerror = (error: string) => { errors.push(error); };

  // Initialize context
  const gl = canvas.getContext(`webgl2`, { alpha: false }) as WebGL2RenderingContext;

  // Image program
  const vert = new GLSLShader(gl, gl.VERTEX_SHADER, CUBE_VERT, onerror);
  const frag = new GLSLShader(gl, gl.FRAGMENT_SHADER, CUBE_FRAG, onerror);
  const program = new GLSLProgram(gl, vert, frag, onerror);
  program.deleteShaders();

  // Create texture and plane
  const texture = new GLSLTexture2D(gl, null, 0, onerror);
  const plane = new GLSLPlane(gl, onerror);

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  return render({
    container,
    canvas,
    gl,
    program,
    texture,
    plane,
    background: WHITE,
    x: 0,
    y: 0,
    scale: 1,
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
  const { gl, container, canvas } = state;

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Update matrices

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
  console.log(background);

  gl.clearColor(background[0], background[1], background[2], background[3]);

  return render({ ...state, background });
};


/**
 * Move the image to the given position.
 *
 * @param state Current state
 * @param x Horizontal position
 * @param y Vertical position
 * @returns Next state
 */
const move = (state: State, x: number, y: number): State => {
  const { container, scale } = state;

  return state;
};

/**
 * Translate the image.
 *
 * @param state Current state
 * @param dx Horizontal displacement
 * @param dy Vertical displacement
 * @param scale New scale
 * @returns Next state
 */
const translate = (state: State, dx: number, dy: number): State => {
  return state;
};

/**
 * Scale the image.
 *
 * @param state Current state
 * @param scale New scale
 * @returns Next state
 */
const scale = (state: State, scale: number, x = NaN, y = NaN): State => {
  const scaleNew = Math.min(SCALE_MAX, Math.max(SCALE_MIN, scale));
  const factor = scaleNew / state.scale;


  return state;
};

/**
 * Release all resources.
 *
 * @param state Current state
 * @returns Next state
 */
const cleanUp = (state: State): State => {
  const { program, texture, plane } = state;

  program.delete();
  texture.delete();
  plane.delete();

  return render(state);
};


/** Initial canvas state */
export const initialCanvas: State = {
  container: null as never,
  canvas: null as never,
  gl: null as never,
  program: null as never,
  texture: null as never,
  plane: null as never,
  background: WHITE,
  x: 0,
  y: 0,
  scale: 1,
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
    case `INITIALIZE`: return initialize(action.container, action.canvas);
    case `RESIZE`: return resize(state);

    case `SET_BACKGROUND`: return setBackground(state, action.background);

    case `TRANSLATE`: return translate(state, action.dx, action.dy);

    case `ZOOM_IN`: return scale(state, state.scale * SCALE_FACTOR, action.x, action.y);
    case `ZOOM_OUT`: return scale(state, state.scale / SCALE_FACTOR, action.x, action.y);
    case `SCALE`: return scale(state, action.scale, action.x, action.y);

    case `CLOSE_ERRORS`: return { ...state, errors: [] };
    case `CLEAN_UP`: return cleanUp(state);
  }
};
