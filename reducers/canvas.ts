import colors from "tailwindcss/colors";
import { vec3 } from "gl-matrix";

import { GLSLShader, GLSLProgram, GLSLCamera } from "../lib/glsl";
import { GLSLCube, GLSLAxis, GLSLGrid, GLSLPoints } from "../lib/glsl/model";

import { toRGB, BLACK, WHITE, RED, GREEN, BLUE, RGB } from "../lib/color";

import CUBE_VERT from "../shaders/cube.vert";
import CUBE_FRAG from "../shaders/cube.frag";
import AXIS_VERT from "../shaders/axis.vert";
import AXIS_FRAG from "../shaders/axis.frag";
import GRID_VERT from "../shaders/grid.vert";
import GRID_FRAG from "../shaders/grid.frag";
import DIAG_VERT from "../shaders/diagonal.vert";
import DIAG_FRAG from "../shaders/diagonal.frag";
import POINTS_VERT from "../shaders/points.vert";
import POINTS_FRAG from "../shaders/points.frag";
import DISTS_VERT from "../shaders/distances.vert";
import DISTS_FRAG from "../shaders/distances.frag";


/** Line color */
type SATURATION = `black` | `rgb`;


/** Canvas state */
export interface CanvasState {
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  readonly background: RGB;
  readonly programCube: GLSLProgram;
  readonly programAxis: GLSLProgram;
  readonly programGrid: GLSLProgram;
  readonly programDiagonal: GLSLProgram;
  readonly programPoints: GLSLProgram;
  readonly programDistances: GLSLProgram;

  readonly camera: GLSLCamera;

  readonly cube: GLSLCube;
  readonly drawCube: boolean;
  readonly alphaIn: number;
  readonly alphaOut: number;

  readonly drawDiagonal: boolean;
  readonly colorDiagonal: SATURATION;
  readonly alphaDiagonal: number;

  readonly axis: GLSLAxis;
  readonly drawAxis: boolean;
  readonly colorAxis: SATURATION;
  readonly alphaAxis: number;

  readonly grid: GLSLGrid;
  readonly drawGrid: boolean;
  readonly colorGrid: SATURATION;
  readonly alphaGrid: number;
  readonly gapGrid: number;

  readonly points: GLSLPoints;
  readonly colorPoints: SATURATION;
  readonly alphaPoints: number;

  readonly colorDistances: SATURATION;
  readonly alphaDistances: number;

  readonly errors: ReadonlyArray<string>;
}

/** Canvas action */
export type CanvasAction = {
  readonly type: `INITIALIZE`;
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
} | {
  readonly type: `SET_BACKGROUND`;
  readonly background: string;
} | {
  readonly type: `RESIZE`;
} | {
  readonly type: `RESET_CAMERA`;
} | {
  readonly type: `SET_PROJECTION`;
  readonly projection: `perspective` | `orthogonal`;
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
  readonly type: `SET_DRAW`;
  readonly model: `CUBE` | `AXIS` | `GRID` | `DIAG`;
  readonly status: boolean;
} | {
  readonly type: `SET_DRAW`;
  readonly model: `POINT`;
  readonly index: `target`;
  readonly status: boolean;
} | {
  readonly type: `SET_DRAW`;
  readonly model: `POINT` | `DIST`;
  readonly index?: number;
  readonly status: boolean;
} | {
  readonly type: `SET_HIGHTLIGHT`;
  readonly model: `POINT`;
  readonly index: `target`;
  readonly status: boolean;
} | {
  readonly type: `SET_HIGHTLIGHT`;
  readonly model: `POINT` | `DIST`;
  readonly index?: number;
  readonly status: boolean;
} | {
  readonly type: `SET_SATURATION`;
  readonly model: `AXIS` | `GRID` | `DIAG` | `POINTS` | `DISTS`;
  readonly mode: SATURATION;
} | {
  readonly type: `SET_ALPHA`;
  readonly model: `IN` | `OUT` | `AXIS` | `GRID` | `DIAG` | `POINTS` | `DISTS`;
  readonly opacity: number;
} | {
  readonly type: `SET_GRID_SIZE`;
  readonly size: number;
} | {
  readonly type: `SET_GRID_GAP`;
  readonly gap: number;
} | {
  readonly type: `SET_POINT_SIZE`;
  readonly size: number;
} | {
  readonly type: `SET_COLOR`;
  readonly index: number | `target`;
  readonly color: string;
} | {
  readonly type: `REMOVE_COLOR`;
  readonly index: number;
} | {
  readonly type: `ADD_COLOR`;
  readonly color: string;
} | {
  readonly type: `CLOSE_ERRORS`;
} | {
  readonly type: `CLEAN_UP`;
};


/**
 * Render the cube.
 *
 * @param state Current state
 * @returns Next state
 */
const render = (state: CanvasState): CanvasState => {
  const {
    gl,
    programCube,
    programAxis,
    programGrid,
    programDiagonal,
    programPoints,
    programDistances,
    camera,
    cube,
    drawCube,
    alphaIn,
    alphaOut,
    drawDiagonal,
    colorDiagonal,
    alphaDiagonal,
    axis,
    drawAxis,
    colorAxis,
    alphaAxis,
    grid,
    drawGrid,
    colorGrid,
    alphaGrid,
    gapGrid,
    points,
    colorPoints,
    alphaPoints,
    colorDistances,
    alphaDistances
  } = state;

  // Reset context
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw cube
  if (drawCube) {
    programCube.use();
    camera.bind(gl, programCube);
    cube.bind();

    const alphaCube = programCube.getLocation(`u_alpha`);

    // Inside
    if (alphaIn) {
      gl.cullFace(gl.BACK);
      gl.uniform1f(alphaCube, alphaIn);
      cube.drawCube();
    }

    // Outside
    if (alphaOut) {
      gl.cullFace(gl.FRONT);
      gl.uniform1f(alphaCube, alphaOut);
      cube.drawCube();
    }
  }

  // Draw grid
  if (drawGrid && alphaGrid) {
    programGrid.use();
    camera.bind(gl, programGrid);
    grid.bind();

    const axis = programGrid.getLocation(`u_axis`);

    gl.uniform1f(programGrid.getLocation(`u_rgb`), colorGrid === `rgb` ? 1 : 0);
    gl.uniform1f(programGrid.getLocation(`u_alpha`), alphaGrid);
    gl.uniform1f(programGrid.getLocation(`u_gap`), gapGrid);

    gl.uniform1i(axis, 0);
    grid.drawX();


    gl.uniform1i(axis, 1);
    grid.drawY();

    gl.uniform1i(axis, 2);
    grid.drawZ();
  }

  // Draw axis
  if (drawAxis && alphaAxis) {
    programAxis.use();
    camera.bind(gl, programAxis);
    axis.bind();

    const color = programAxis.getLocation(`u_color`);

    gl.uniform1f(programAxis.getLocation(`u_alpha`), alphaAxis);

    if (colorAxis === `rgb`) {
      gl.uniform3fv(color, RED);
      axis.drawX();

      gl.uniform3fv(color, GREEN);
      axis.drawY();

      gl.uniform3fv(color, BLUE);
      axis.drawZ();
    }
    else {
      gl.uniform3fv(color, BLACK);

      axis.draw();
    }
  }

  // Draw diagonal
  if (drawDiagonal && alphaDiagonal) {
    programDiagonal.use();
    camera.bind(gl, programDiagonal);
    cube.bind();

    gl.uniform1f(programDiagonal.getLocation(`u_rgb`), colorDiagonal === `rgb` ? 1 : 0);
    gl.uniform1f(programDiagonal.getLocation(`u_alpha`), alphaDiagonal);
    cube.drawDiagonal();
  }

  // Draw distances
  programDistances.use();
  camera.bind(gl, programDistances);
  points.bind();

  gl.uniform1f(programDistances.getLocation(`u_alpha`), alphaDistances);
  points.drawDistances(name => programDistances.getLocation(name), colorDistances === `rgb` ? 1 : 0);

  // Draw points and distances
  programPoints.use();
  camera.bind(gl, programPoints);
  cube.bind();

  gl.uniform1f(programPoints.getLocation(`u_rgb`), colorPoints === `rgb` ? 1 : 0);
  gl.uniform1f(programPoints.getLocation(`u_alpha`), alphaPoints);
  points.drawPoints(name => programPoints.getLocation(name), () => { cube.drawCube(); });


  // Return state
  return {
    container: state.container,
    canvas: state.canvas,
    gl,
    background: state.background,
    programCube,
    programAxis,
    programGrid,
    programDiagonal,
    programPoints,
    programDistances,
    camera,
    cube,
    drawCube,
    alphaOut,
    alphaIn,
    drawDiagonal,
    colorDiagonal,
    alphaDiagonal,
    axis,
    drawAxis,
    colorAxis,
    alphaAxis,
    grid,
    drawGrid,
    colorGrid,
    alphaGrid,
    gapGrid,
    points,
    colorPoints,
    alphaPoints,
    colorDistances,
    alphaDistances,
    errors: state.errors
  };
};


/**
 * Initialize canvas state.
 *
 * @param state Current state
 * @param container Canvas container
 * @param canvas Canvas element
 * @returns Next state
 */
const initialize = (state: CanvasState, container: HTMLDivElement, canvas: HTMLCanvasElement): CanvasState => {
  // Error handler function
  const errors: string[] = [];
  const onerror = (error: string) => { errors.push(error); };

  // Initialize and setup context
  const gl = canvas.getContext(`webgl2`, { alpha: false }) as WebGL2RenderingContext;
  const bg = initialCanvas.background;

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(bg[0], bg[1], bg[2], 1);

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // GLSL Programs
  const programCube = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, CUBE_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, CUBE_FRAG, onerror),
    onerror
  );
  const programAxis = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, AXIS_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, AXIS_FRAG, onerror),
    onerror
  );
  const programGrid = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, GRID_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, GRID_FRAG, onerror),
    onerror
  );
  const programDiagonal = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, DIAG_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, DIAG_FRAG, onerror),
    onerror
  );
  const programPoints = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, POINTS_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, POINTS_FRAG, onerror),
    onerror
  );
  const programDistances = new GLSLProgram(
    gl,
    new GLSLShader(gl, gl.VERTEX_SHADER, DISTS_VERT, onerror),
    new GLSLShader(gl, gl.FRAGMENT_SHADER, DISTS_FRAG, onerror),
    onerror
  );

  // Delete shaders
  programCube.deleteShaders();
  programAxis.deleteShaders();
  programGrid.deleteShaders();
  programDiagonal.deleteShaders();
  programPoints.deleteShaders();
  programDistances.deleteShaders();

  // Cube and axis
  const cube = new GLSLCube(gl, onerror);
  const axis = new GLSLAxis(gl, onerror);
  const grid = new GLSLGrid(gl, onerror);
  const points = new GLSLPoints(gl, onerror);

  // Update camera resolution
  const { camera } = state;
  camera.resolution = { width: container.offsetWidth, height: container.offsetHeight };
  camera.position = [ 0, 0, -7 ];
  camera.rotate([ -150, -100 ], [ 0, 0, 0 ]);

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
    ...initialCanvas,
    container,
    canvas,
    gl,
    programCube,
    programAxis,
    programGrid,
    programDiagonal,
    programPoints,
    programDistances,
    camera,
    cube,
    axis,
    grid,
    points,
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
  const background = toRGB(bg) || WHITE;

  gl.clearColor(background[0], background[1], background[2], 1);

  return render({ ...state, background });
};


/**
 * Release all resources.
 *
 * @param state Current state
 * @returns Next state
 */
const cleanUp = (state: CanvasState): CanvasState => {
  const { programCube: program, cube } = state;

  program.delete();
  cube.delete();

  return render(state);
};


/** Initial canvas state */
export const initialCanvas: CanvasState = {
  container: null as never,
  canvas: null as never,
  gl: null as never,
  background: toRGB(colors.blueGray[`50`]) || WHITE,
  programCube: null as never,
  programAxis: null as never,
  programGrid: null as never,
  programDiagonal: null as never,
  programPoints: null as never,
  programDistances: null as never,
  camera: new GLSLCamera(),
  cube: null as never,
  drawCube: true,
  alphaIn: 0.3,
  alphaOut: 0.25,
  drawDiagonal: false,
  colorDiagonal: `rgb`,
  alphaDiagonal: 0.6,
  axis: null as never,
  drawAxis: true,
  colorAxis: `rgb`,
  alphaAxis: 0.7,
  grid: null as never,
  drawGrid: false,
  colorGrid: `black`,
  alphaGrid: 0.5,
  gapGrid: 8,
  points: null as never,
  colorPoints: `rgb`,
  alphaPoints: 0.9,
  colorDistances: `black`,
  alphaDistances: 0.45,
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
  const { camera, points } = state;


  switch (action.type) {
    case `INITIALIZE`: return initialize(state, action.container, action.canvas);

    case `SET_BACKGROUND`: return setBackground(state, action.background);

    case `RESIZE`: return resize(state);

    case `RESET_CAMERA`:
      camera.reset();
      return render(state);

    case `SET_PROJECTION`:
      camera.projection = action.projection;
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

    case `SET_DRAW`: switch (action.model) {
      case `CUBE`: return render({ ...state, drawCube: action.status });
      case `AXIS`: return render({ ...state, drawAxis: action.status });
      case `GRID`: return render({ ...state, drawGrid: action.status });
      case `DIAG`: return render({ ...state, drawDiagonal: action.status });
      case `POINT`:
        action.index === undefined ?
          points.setDrawPoints(action.status) :
          points.setDrawPoint(action.index, action.status);
        return render(state);

      case `DIST`:
        action.index === undefined ?
          points.setDrawDistances(action.status) :
          points.setDrawDistance(action.index, action.status);
        return render(state);

      default: return state;
    }

    case `SET_HIGHTLIGHT`: switch(action.model) {
      case `POINT`:
        action.index === undefined ?
          points.setHightlightPoints(action.status) :
          points.setHightlightPoint(action.index, action.status);
        return render(state);

      case `DIST`:
        action.index === undefined ?
          points.setHightlightDistances(action.status) :
          points.setHightlightDistance(action.index, action.status);
        return render(state);

      default: return state;
    }

    case `SET_SATURATION`: switch (action.model) {
      case `AXIS`:   return render({ ...state, colorAxis: action.mode });
      case `GRID`:   return render({ ...state, colorGrid: action.mode });
      case `DIAG`:   return render({ ...state, colorDiagonal: action.mode });
      case `POINTS`: return render({ ...state, colorPoints: action.mode });
      case `DISTS`:  return render({ ...state, colorDistances: action.mode });
      default: return state;
    }

    case `SET_ALPHA`: switch (action.model) {
      case `IN`:     return render({ ...state, alphaIn: Math.max(0, Math.min(1, action.opacity)) });
      case `OUT`:    return render({ ...state, alphaOut: Math.max(0, Math.min(1, action.opacity)) });
      case `AXIS`:   return render({ ...state, alphaAxis: Math.max(0, Math.min(1, action.opacity)) });
      case `GRID`:   return render({ ...state, alphaGrid: Math.max(0, Math.min(1, action.opacity)) });
      case `DIAG`:   return render({ ...state, alphaDiagonal: Math.max(0, Math.min(1, action.opacity)) });
      case `POINTS`: return render({ ...state, alphaPoints: Math.max(0, Math.min(1, action.opacity)) });
      case `DISTS`:  return render({ ...state, alphaDistances: Math.max(0, Math.min(1, action.opacity)) });
      default: return state;
    }

    case `SET_GRID_SIZE`:
      state.grid.size = action.size;
      return render(state);

    case `SET_GRID_GAP`: return render({ ...state, gapGrid: action.gap });

    case `SET_POINT_SIZE`: points.size = action.size; return render(state);
    case `SET_COLOR`: points.setColor(action.index, toRGB(action.color) || BLACK); return render(state);
    case `ADD_COLOR`: points.addColor(toRGB(action.color) || BLACK); return render(state);
    case `REMOVE_COLOR`: points.removeColor(action.index); return render(state);

    case `CLOSE_ERRORS`: return { ...state, errors: [] };
    case `CLEAN_UP`: return cleanUp(state);

    default: return state;
  }
};
