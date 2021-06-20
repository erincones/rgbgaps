import { glMatrix, vec2, vec3, mat4 } from "gl-matrix";
import { toRad, toDeg, merge } from "./helpers";
import { GLSLProgram } from "./program";


/** Camera projection properties */
export interface GLSLCameraProjection {
  type: `perspective` | `orthogonal`;
  near: number;
  far: number;
  fov: number;
  fovMin: number;
  fovMax: number;
}

/** Camera view properties */
export interface GLSLCameraView {
  reference: `self` | `target`,
  position: vec3;
  front: vec3;
  right: vec3;
  up: vec3;
  pitch: number;
  yaw: number;
}

/** Camera dynamic properties */
export interface GLSLCameraDynamic {
  fast: boolean;
  speed: number;
  speedFast: number;
  sensibility: number;
  zoomFactor: number;
}

/** Resolution */
interface Resolution {
  width: number;
  height: number;
}

/** Clipping */
interface Clipping {
  near: number;
  far: number;
}

/** Movement */
type Movement = `RIGHT` | `LEFT` | `UP` | `DOWN` | `FRONT` | `BACK`;


/**
 * GLSL camera.
 */
export class GLSLCamera {
  /** Static default projection properties */
  private static _defaultProjection: GLSLCameraProjection = {
    type: `perspective`,
    near: 0.01,
    far: 10.0,
    fov: toRad(30),
    fovMin: toRad(glMatrix.EPSILON),
    fovMax: toRad(180)
  };

  /** Static default view properties */
  private static _defaultView: GLSLCameraView = {
    reference: `self`,
    position: vec3.fromValues(0, 0, 2),
    front: vec3.fromValues(0, 0, -1),
    right: vec3.fromValues(1, 0, 0),
    up: vec3.fromValues(0, 1, 0),
    pitch: -90,
    yaw: 0
  };

  /** Static default dynamic properties */
  private static _defaultDynamic: GLSLCameraDynamic = {
    fast: false,
    speed: 0.5,
    speedFast: 1,
    sensibility: 15,
    zoomFactor: 1.0625
  };


  /** Default projection properties */
  private _defaultProjection: GLSLCameraProjection;

  /** Default view properties */
  private _defaultView: GLSLCameraView;

  /** Default dynamic properties */
  private _defaultDynamic: GLSLCameraDynamic;


  /** Projection type */
  private _projection = GLSLCamera._defaultProjection.type;

  /** Resolution width */
  private _width: number;

  /** Resolution height */
  private _height: number;

  /** Clipping near */
  private _near = GLSLCamera._defaultProjection.near;

  /** Clipping far */
  private _far = GLSLCamera._defaultProjection.far;

  /** Field of view */
  private _fov = GLSLCamera._defaultProjection.fov;

  /** Minimum field of view */
  private _fovMin = GLSLCamera._defaultProjection.fovMin;

  /** Maximum field of view */
  private _fovMax = GLSLCamera._defaultProjection.fovMax;

  /** Perspective matrix */
  private _perspective = mat4.create();

  /** Orthotogonal matrix */
  private _orthogonal = mat4.create();


  /** Rotation reference */
  private _reference = GLSLCamera._defaultView.reference;

  /** Position */
  private _position = vec3.clone(GLSLCamera._defaultView.position);

  /** Normalized direction */
  private _front = vec3.clone(GLSLCamera._defaultView.front);

  /** Normalized right */
  private _right = vec3.clone(GLSLCamera._defaultView.right);

  /** Normalized world up */
  private _up = vec3.clone(GLSLCamera._defaultView.up);

  /** Pitch rotation */
  private _pitch = GLSLCamera._defaultView.pitch;

  /** Yaw rotation */
  private _yaw = GLSLCamera._defaultView.yaw;

  /** View matrix */
  private _view = mat4.create();


  /** Fast flag */
  public fast = GLSLCamera._defaultDynamic.fast;

  /** Normal speed */
  public speed = GLSLCamera._defaultDynamic.speed;

  /** Fast speed */
  public speedFast = GLSLCamera._defaultDynamic.speedFast;

  /** Mouse sensibility */
  public sensibility = GLSLCamera._defaultDynamic.sensibility;

  /** Zoom factor */
  public zoomFactor = GLSLCamera._defaultDynamic.zoomFactor;


  /**
   * Creates a new GLSL camera.
   *
   * @param width Canvas width
   * @param height Canvas height
   */
  constructor(width = 300, height = 150) {
    this._defaultProjection = GLSLCamera._defaultProjection;
    this._defaultView = GLSLCamera._defaultView;
    this._defaultDynamic = GLSLCamera._defaultDynamic;

    this._width = width;
    this._height = height;

    this.updateMatrices();
  }


  /**
   * Reset projection properties to default.
   */
  private resetProjection(): void {
    this._projection = this._defaultProjection.type;
    this._near = this._defaultProjection.near;
    this._far = this._defaultProjection.far;
    this._fov = this._defaultProjection.fov;
  }

  /**
   * Reset view properties to default.
   */
  private resetView(): void {
    vec3.copy(this._position, this._defaultView.position);
    vec3.copy(this._front, this._defaultView.front);
    vec3.copy(this._right, this._defaultView.right);
    vec3.copy(this._up, this._defaultView.up);
    this._pitch = this._defaultView.pitch;
    this._yaw = this._defaultView.yaw;
  }

  /**
   * Reset dynamic properties to default.
   */
  private resetDynamic(): void {
    this.fast = this._defaultDynamic.fast;
    this.speed = this._defaultDynamic.speed;
    this.speedFast = this._defaultDynamic.speedFast;
    this.sensibility = this._defaultDynamic.sensibility;
    this.zoomFactor = this._defaultDynamic.zoomFactor;
  }


  /**
   * Update view matrix.
   */
  private updateViewMatrix(): void {
    mat4.lookAt(this._view, this._position, this._front, this._up);
  }

  /**
   * Update projection matrices.
   */
  private updateProjectionMatrices(): void {
    const aspect = this._width / this._height;
    const y = Math.atan(this._fov / 2);
    const x = y * aspect;

    mat4.ortho(this._orthogonal, -x, x, -y, y, this._near, this._far);
    mat4.perspective(this._perspective, this._fov, aspect, this._near, this._far);
  }

  /**
   * Update matrices.
   */
  private updateMatrices(): void {
    this.updateViewMatrix();
    this.updateProjectionMatrices();
  }


  /** Default projection properties */
  public get defaultProjection(): GLSLCameraProjection {
    return {
      type: this._defaultProjection.type,
      near: this._defaultProjection.near,
      far: this._defaultProjection.far,
      fov: this._defaultProjection.fov,
      fovMin: this._defaultProjection.fovMin,
      fovMax: this._defaultProjection.fovMax
    };
  }

  /** Default projection properties */
  public set defaultProjection(values: Partial<GLSLCameraProjection>) {
    merge(this._defaultProjection, values, `type`);
    merge(this._defaultProjection, values, `near`);
    merge(this._defaultProjection, values, `far`);
    merge(this._defaultProjection, values, `fov`);
    merge(this._defaultProjection, values, `fovMin`);
    merge(this._defaultProjection, values, `fovMax`);
  }

  /** Default view properties */
  public get defaultView(): GLSLCameraView {
    return {
      reference: this._defaultView.reference,
      position: vec3.clone(this._defaultView.position),
      front: vec3.clone(this._defaultView.front),
      right: vec3.clone(this._defaultView.right),
      up: vec3.clone(this._defaultView.up),
      pitch: this._defaultView.pitch,
      yaw: this._defaultView.yaw
    };
  }

  /** Default view properties */
  public set defaultView(values: Partial<GLSLCameraView>) {
    merge(this._defaultView, values, `reference`);
    merge(this._defaultView, values, `position`, vec3);
    merge(this._defaultView, values, `front`, vec3);
    merge(this._defaultView, values, `right`, vec3);
    merge(this._defaultView, values, `up`, vec3);
    merge(this._defaultView, values, `pitch`);
    merge(this._defaultView, values, `yaw`);
  }

  /** Default dynamic properties */
  public get defaultDynamic(): GLSLCameraDynamic {
    return {
      fast: this._defaultDynamic.fast,
      speed: this._defaultDynamic.speed,
      speedFast: this._defaultDynamic.speedFast,
      sensibility: this._defaultDynamic.sensibility,
      zoomFactor: this._defaultDynamic.zoomFactor
    };
  }

  /** Default dynamic properties */
  public set defaultDynamic(values: Partial<GLSLCameraDynamic>) {
    merge(this._defaultDynamic, values, `fast`);
    merge(this._defaultDynamic, values, `speed`);
    merge(this._defaultDynamic, values, `speedFast`);
    merge(this._defaultDynamic, values, `sensibility`);
    merge(this._defaultDynamic, values, `zoomFactor`);
  }


  /** Projection type */
  public get projection(): GLSLCamera["_projection"] {
    return this._projection;
  }

  /** Projection type */
  public set projection(projection: GLSLCamera["_projection"]) {
    this._projection = projection;
  }

  /** Resolution */
  public get resolution(): Resolution {
    return {
      width: this._width,
      height: this._height
    };
  }

  /** Resolution */
  public set resolution({ width, height }: Resolution) {
    let update = false;

    if (width !== this._width) {
      update = true;
      this._width = width;
    }

    if (height !== this._height) {
      update = true;
      this._height = glMatrix.equals(height, 0) ? glMatrix.EPSILON : height;
    }

    if (update) {
      this.updateProjectionMatrices();
    }
  }

  /** Resolution width */
  public get width(): number {
    return this._width;
  }

  /** Resolution width */
  public set width(width: number) {
    if (this._width !== width) {
      this._width = width;
      this.updateProjectionMatrices();
    }
  }

  /** Resolution height */
  public get height(): number {
    return this._height;
  }

  /** Resolution height */
  public set height(height: number) {
    if (this._height !== height) {
      this._height = glMatrix.equals(height, 0) ? glMatrix.EPSILON : height;
      this.updateProjectionMatrices();
    }
  }

  /** Clipping */
  public get clipping(): Clipping {
    return {
      near: this._near,
      far: this._far
    };
  }

  /** Clipping */
  public set clipping({ near, far }: Clipping) {
    let update = false;

    if (near !== this._near) {
      update = true;
      this._near = near;
    }

    if (far !== this._far) {
      update = true;
      this._far = far;
    }

    if (update) {
      this.updateProjectionMatrices();
    }
  }

  /** Clipping near */
  public get near(): number {
    return this._near;
  }

  /** Clipping near */
  public set near(near: number) {
    if (this._near !== near) {
      this._near = near;
      this.updateProjectionMatrices();
    }
  }

  /** Clipping far */
  public get far(): number {
    return this._far;
  }

  /** Clipping far */
  public set far(far: number) {
    if (this._far !== far) {
      this._far = far;
      this.updateProjectionMatrices();
    }
  }

  /** Field of view */
  public get fov(): number {
    return toDeg(this._fov);
  }

  /** Field of view */
  public set fov(fov: number) {
    if (this._fov !== fov) {
      const rad = toRad(fov);
      this._fov = Math.max(this._fovMin, Math.min(this._fovMax, rad));
      this.updateProjectionMatrices();
    }
  }

  /** Minimum field of view */
  public get fovMin(): number {
    return toDeg(this._fovMin);
  }

  /** Minimum field of view */
  public set fovMin(fovMin: number) {
    if (this._fovMin !== fovMin) {
      const rad = Math.min(this._fovMax, toRad(fovMin));
      this._fovMin = rad;

      if (this._fov < rad) {
        this._fov = rad;
        this.updateProjectionMatrices();
      }
    }
  }

  /** Maximum field of view */
  public get fovMax(): number {
    return toDeg(this._fovMax);
  }

  /** Maximum field of view */
  public set fovMax(fovMax: number) {
    if (this._fovMax !== fovMax) {
      const rad = Math.max(this._fovMin, toRad(fovMax));
      this._fovMax = rad;

      if (this._fov > rad) {
        this._fov = rad;
        this.updateProjectionMatrices();
      }
    }
  }

  /** Perspective matrix */
  public get perspective(): mat4 {
    return mat4.clone(this._perspective);
  }

  /** Orthotogonal matrix */
  public get orthogonal(): mat4 {
    return mat4.clone(this._orthogonal);
  }


  /** Rotation reference */
  public get reference(): GLSLCamera["_reference"] {
    return this._reference;
  }

  /** Rotation reference */
  public set reference(reference: GLSLCamera["_reference"]) {
    this._reference = reference;
  }

  /** Position */
  public get position(): vec3 {
    return vec3.clone(this._position);
  }

  /** Position */
  public set position(position: vec3) {
    vec3.copy(this._position, position);
    this.updateMatrices();
  }

  /** Normalized direction */
  public get front(): vec3 {
    return vec3.clone(this._front);
  }

  /** Normalized direction */
  public set front(front: vec3) {
    vec3.normalize(this._front, front);
    vec3.cross(this._right, this._front, this._up);
    this.updateViewMatrix();
  }

  /** Normalized right */
  public get right(): vec3 {
    return vec3.clone(this._right);
  }

  /** Normalized world up */
  public get up(): vec3 {
    return vec3.clone(this._up);
  }

  /** Normalized world up */
  public set up(up: vec3) {
    vec3.normalize(this._up, up);
    vec3.cross(this._right, this._front, this._up);
    this.updateViewMatrix();
  }

  /** Rotation angles */
  public get rotation(): vec3 {
    return vec3.fromValues(
      toDeg(Math.atan2(this._front[2], this._front[0])),
      toDeg(Math.asin(this._front[1])),
      toDeg(Math.asin(this._up[0]))
    );
  }

  /** Rotation angles */
  public set rotation(angles: vec3) {
    const rad = angles.map(v => toRad(v));

    this._front[0] = Math.cos(rad[1]) * Math.cos(rad[0]);
    this._front[1] = Math.sin(rad[1]);
    this._front[2] = Math.cos(rad[1]) * Math.sin(rad[0]);
    vec3.normalize(this._front, this._front);

    this._up[0] = Math.sin(rad[2]);
    this._up[1] = Math.cos(rad[2]);
    vec3.normalize(this._up, this._up);

    vec3.cross(this._right, this._front, this._up);

    this.updateViewMatrix();
  }

  /** Pitch rotation */
  public get pitch(): number {
    return this._pitch;
  }

  /** Yaw rotation */
  public get yaw(): number {
    return this._yaw;
  }

  /** View matrix */
  public get view(): mat4 {
    return mat4.clone(this._view);
  }


  /**
   * Reset all properties to default.
   */
  public reset(): void {
    this.resetProjection();
    this.resetView();
    this.resetDynamic();

    this.updateMatrices();
  }

  /**
   * Reset geometry properties to default.
   */
  public resetGeometry(): void {
    this.resetProjection();
    this.resetView();

    this.updateMatrices();
  }


  /**
   * Bind camera.
   *
   * @param gl WebGL context
   * @param program Current program
   */
  public bind(gl: WebGLContext, program: GLSLProgram): void {
    if (!program.status) return;

    gl.uniform3fv(program.getLocation(`u_eye`), this._position);
    gl.uniform3fv(program.getLocation(`u_ray`), this._front);
    gl.uniform3fv(program.getLocation(`u_up`), this._up);
    gl.uniform1f(program.getLocation(`u_fov`), this._fov);
    gl.uniformMatrix4fv(program.getLocation(`u_view`), false, this._view);
    gl.uniformMatrix4fv(program.getLocation(`u_proj`), false, this._projection === `orthogonal` ? this._orthogonal : this._perspective);
  }

  /**
   * Travell the camera.
   *
   * @param movement Movement
   * @param time Time
   */
  public travell(movement: Movement, time = 1 / 30): void {
    const distance = (this.fast ? this.speedFast : this.speed) * time;

    switch (movement) {
      case `RIGHT`: vec3.scaleAndAdd(this._position, this._position, this._right, distance); break;
      case `LEFT`:  vec3.scaleAndAdd(this._position, this._position, this._right, -distance); break;
      case `UP`:    vec3.scaleAndAdd(this._position, this._position, this._up, distance); break;
      case `DOWN`:  vec3.scaleAndAdd(this._position, this._position, this._up, -distance); break;
      case `FRONT`: vec3.scaleAndAdd(this._position, this._position, vec3.cross(vec3.create(), this._up, this._right), distance); break;
      case `BACK`:  vec3.scaleAndAdd(this._position, this._position, vec3.cross(vec3.create(), this._up, this._right), -distance);
    }

    this.updateMatrices();
  }

  /**
   * Translate the camera.
   *
   * @param displacement Displacement
   */
  public translate(displacement: vec3): void {
    vec3.add(this._position, this._position, displacement);
    this.updateViewMatrix();
  }

  /**
   * Rotate the camera.
   *
   * @param displacement Displacement
   */
  public rotate(displacement: vec2): void {
    this._yaw = displacement[0] * this.sensibility;
    this._pitch = Math.max(-89.0, Math.min(89.0, this._pitch + displacement[1] * this.sensibility));

    this.front = vec3.fromValues(
      Math.cos(toRad(this._pitch)) * Math.cos(toRad(this._yaw)),
      Math.sin(toRad(this._pitch)),
      Math.cos(toRad(this._pitch)) * Math.sin(toRad(this._yaw))
    );
  }

  /**
   * Increase zoom.
   */
  public zoomIn(): void {
    const fov = Math.min(this._fovMax, this._fov / this.zoomFactor);

    if (fov !== this._fov) {
      this._fov = fov;
      this.updateProjectionMatrices();
    }
  }

  /**
   * Decrease zoom.
   */
  public zoomOut(): void {
    const fov = Math.max(this._fovMax, this._fov * this.zoomFactor);

    if (fov !== this._fov) {
      this._fov = fov;
      this.updateProjectionMatrices();
    }
  }
}
