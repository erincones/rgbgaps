import { GLSLObject } from "../object";

import { distanceRGB, randRGB, BLACK, WHITE, GRAY, RED, GREEN, BLUE, RGB } from "../../color";


/** Draw function */
type DrawFunction = () => void;

/** Uniform location function */
type UniformLocationGetter = (name: string) => WebGLUniformLocation | null;


/** Color data */
interface Color {
  rgb: RGB;
  distance: number;
  drawPoint: boolean;
  drawDistance: boolean;
  hightlightPoint: boolean;
  hightlightDistance: boolean;
}


/**
 * GLSL points.
 */
export class GLSLPoints extends GLSLObject<WebGL2RenderingContext> {
  /** Points data */
  private _data: Readonly<Float32Array> = new Float32Array();

  /** Points index */
  private _index: Readonly<Uint32Array> = new Uint32Array();

  /** Vertex array object */
  private _vao: WebGLVertexArrayObject | null;

  /** Vertex buffer object */
  private _vbo: WebGLBuffer | null;

  /** Element buffer object */
  private _ebo: WebGLBuffer | null;

  /** Target color */
  private _target: RGB = GRAY;

  /** Colors */
  private _colors: Color[] = [];

  /** Nearest index */
  private _nearest = -1;

  /** Farthest index */
  private _farthest = -1;

  /** Draw target */
  public drawTarget = true;

  /** Hightlight target */
  public hightlightTargetPoint = true;

  /** Point size */
  public size = 3 / 256;


  /**
   * Creates a new points.
   */
  constructor(gl: WebGL2RenderingContext, onerror?: ErrorHandler) {
    super(gl);

    this._vao = gl.createVertexArray();

    if (this._vao === null) {
      this._vbo = null;
      this._ebo = null;
      this._status = false;

      GLSLObject.handleError(`could not create the VAO:\nunknown error`, onerror);
    }
    else {
      this._vbo = gl.createBuffer();
      this._ebo = gl.createBuffer();

      if (this._vbo === null) {
        this._status = false;

        GLSLObject.handleError(`could not create the VBO:\nunknown error`, onerror);
      }
      else if (this._ebo === null) {
        this._status = false;

        GLSLObject.handleError(`could not create the EBO:\nunknown error`, onerror);
      }
      else {
        this._status = true;

        gl.bindVertexArray(this._vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo);

        gl.enableVertexAttribArray(0);


        this._colors = [ ...Array(5) ].map(() => {
          const rgb = randRGB();

          return {
            rgb,
            distance: distanceRGB(rgb, this._target),
            drawPoint: true,
            drawDistance: true,
            hightlightPoint: false,
            hightlightDistance: false
          };
        });

        this.updateData();
      }
    }
  }


  /**
   * Get vertex position of the given RGB color.
   *
   * @param rgb RGB color
   * @returns Vertex position
   */
  private static toSpace(rgb: RGB): number[] {
    return rgb.map(c => c * 2 - 1);
  }

  /**
   * Calculate nearest, farthest and update the data
   */
  private updateData(): void {
    const data: number[] = GLSLPoints.toSpace(this._target);
    const index: number[] = [];

    const oldNearest = this._colors[this._nearest] || { hightlightPoint: true, hightlightDistance: true };
    const oldFarthest = this._colors[this._farthest] || { hightlightPoint: true, hightlightDistance: true };

    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    this._colors.forEach((color, i) => {
      if (color.distance < min) {
        min = color.distance;
        this._nearest = i;
      }

      if (color.distance > max) {
        max = color.distance;
        this._farthest = i;
      }

      data.push(...GLSLPoints.toSpace(color.rgb));
      index.push(0, i + 1);
    });


    const newNearest = this._colors[this._nearest];
    const newFarthest = this._colors[this._farthest];
    const inverted = oldFarthest === newNearest;

    if (oldNearest.hightlightPoint) {
      oldNearest.hightlightPoint = false;
      newNearest.hightlightPoint = true;
    }

    if (oldNearest.hightlightDistance) {
      oldNearest.hightlightDistance = false;
      newNearest.hightlightDistance = true;
    }

    if (oldFarthest.hightlightPoint) {
      oldFarthest.hightlightPoint = inverted;
      newFarthest.hightlightPoint = true;
    }

    if (oldFarthest.hightlightDistance) {
      oldFarthest.hightlightDistance = inverted;
      newFarthest.hightlightDistance = true;
    }


    this._data = new Float32Array(data);
    this._index = new Uint32Array(index);

    if (this._status) {
      this.gl.bindVertexArray(this._vao);

      this.gl.bufferData(this.gl.ARRAY_BUFFER, this._data, this.gl.STREAM_DRAW);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this._index, this.gl.STREAM_DRAW);

      this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    }
  }

  /**
   * Draw point hightlight.
   *
   * @param draw Draw function
   * @param color Color uniform location
   * @param size Size uniform location
   * @param border Border color
   */
  private drawHightlight(draw: DrawFunction, color: WebGLUniformLocation | null, size: WebGLUniformLocation | null, border: RGB): void {
    this.gl.uniform1f(size, this.size + 3 / 512);
    this.gl.uniform3fv(color, BLACK);
    draw();

    this.gl.uniform1f(size, this.size + 2 / 512);
    this.gl.uniform3fv(color, border);
    draw();

    this.gl.uniform1f(size, this.size + 1 / 512);
    this.gl.uniform3fv(color, BLACK);
    draw();
  }


  /** Points data */
  public get data(): Readonly<Float32Array> {
    return this._data;
  }

  /** Points index */
  public get index(): Readonly<Uint32Array> {
    return this._index;
  }

  /** Target color */
  public get target(): RGB {
    return this._target;
  }

  /** Target color */
  public set target(rgb: RGB) {
    this._target = rgb;

    this._colors.forEach(color => {
      color.distance = distanceRGB(color.rgb, rgb);
    });

    this.updateData();
  }

  /** Colors */
  public get colors(): ReadonlyArray<Readonly<Color>> {
    return this._colors;
  }

  /** Colors */
  public set colors(palette: ReadonlyArray<Readonly<Color>>) {
    this._colors = palette.map(color => {
      return {
        ...color,
        distance: distanceRGB(color.rgb, this._target)
      };
    });

    const left = 2 - this._colors.length;

    if (left > 0) {
      const missing = [ ...Array(left) ].map(() => {
        const rgb = randRGB();

        return {
          rgb,
          distance: distanceRGB(rgb, this._target),
          drawPoint: true,
          drawDistance: true,
          hightlightPoint: true,
          hightlightDistance: true
        };
      });

      this._colors.push(...missing);
    }

    this.updateData();
  }

  /** Nearest color */
  public get nearest(): Readonly<Color> {
    return this._colors[this._nearest];
  }

  /** Nearest index */
  public get nearestIndex(): number {
    return this._nearest;
  }

  /** Farthest color */
  public get farthest(): Readonly<Color> {
    return this._colors[this._farthest];
  }

  /** Farthest index */
  public get farthestIndex(): number {
    return this._farthest;
  }

  /** Vertex array object */
  public get vao(): WebGLVertexArrayObject | null {
    return this._vao;
  }

  /** Vertex buffer object */
  public get vbo(): WebGLBuffer | null {
    return this._vbo;
  }

  /** Element buffer object */
  public get ebo(): WebGLBuffer | null {
    return this._ebo;
  }


  /**
   * Get color at the given index.
   *
   * @param i Color index
   * @returns Color
   */
  public getColor(i: number): Readonly<Color> {
    return this._colors[i];
  }

  /**
   * Set color at the given index.
   *
   * @param i Color index
   * @param rgb Color
   */
  public setColor(i: number | `target`, rgb: RGB): void {
    if (i === `target`) {
      this.target = rgb;
    }
    else {
      const color = this._colors[i];
      color.rgb = rgb;
      color.distance = distanceRGB(rgb, this._target);

      this.updateData();
    }
  }


  /**
   * Get if all points are drawable.
   *
   * @returns Whether all points are drawable
   */
  public drawingAllPoints(): boolean {
    return this.drawTarget && this._colors.every(({ drawPoint }) => drawPoint);
  }

  /**
   * Set draw point at the given index.
   *
   * @param i Color index
   * @param draw Draw status
   */
  public setDrawPoint(i: number | `target`, draw: boolean): void {
    if (i === `target`) {
      this.drawTarget = draw;
    }
    else {
      const color = this._colors[i];
      color.drawPoint = draw;
    }
  }

  /**
   * Set draw points.
   *
   * @param draw Draw status
   */
  public setDrawPoints(draw: boolean): void {
    this.drawTarget = draw;

    this._colors.forEach(color => {
      color.drawPoint = draw;
    });
  }

  /**
   * Get if all distances are drawable.
   *
   * @returns Whether all ditances are drawable
   */
  public drawingAllDistances(): boolean {
    return this._colors.every(({ drawDistance }) => drawDistance);
  }

  /**
   * Set draw distance at the given index.
   *
   * @param i Color index
   * @param draw Draw status
   */
  public setDrawDistance(i: number, draw: boolean): void {
    const color = this._colors[i];
    color.drawDistance = draw;
  }

  /**
   * Set draw distances.
   *
   * @param draw Draw status
   */
  public setDrawDistances(draw: boolean): void {
    this._colors.forEach(color => {
      color.drawDistance = draw;
    });
  }


  /**
   * Get if all points are hightlighted.
   *
   * @returns Whether all points are hightlighted
   */
  public hightlightedAllPoints(): boolean {
    return this._colors.every(({ hightlightPoint }) => hightlightPoint);
  }

  /**
   * Set hightlight point at the given index.
   *
   * @param i Color index
   * @param hightlight Hightlight status
   */
  public setHightlightPoint(i: number | `target`, hightlight: boolean): void {
    if (i === `target`) {
      this.hightlightTargetPoint = hightlight;
    }
    else {
      const color = this._colors[i];
      color.hightlightPoint = hightlight;
    }
  }

  /**
   * Set hightlight points.
   *
   * @param hightlight Hightlight status
   */
  public setHightlightPoints(hightlight: boolean): void {
    this.hightlightTargetPoint = hightlight;

    this._colors.forEach(color => {
      color.hightlightPoint = hightlight;
    });
  }

  /**
   * Get if all distances are hightlighted.
   *
   * @returns Whether all ditances are hightlighted
   */
  public hightlightedAllDistances(): boolean {
    return this._colors.every(({ hightlightDistance }) => hightlightDistance);
  }

  /**
   * Set hightlight distance at the given index.
   *
   * @param i Color index
   * @param hightlight Hightlight status
   */
  public setHightlightDistance(i: number, hightlight: boolean): void {
    const color = this._colors[i];
    color.hightlightDistance = hightlight;
  }

  /**
   * Set hightlight distances.
   *
   * @param hightlight Hightlight status
   */
  public setHightlightDistances(hightlight: boolean): void {
    this._colors.forEach(color => {
      color.hightlightDistance = hightlight;
    });
  }


  /**
   * Add a new color.
   *
   * @param rgb RGB Color
   */
  public addColor(rgb: RGB): void {
    this._colors.push({
      rgb,
      distance: distanceRGB(rgb, this._target),
      drawPoint: true,
      drawDistance: true,
      hightlightPoint: false,
      hightlightDistance: false
    });

    this.updateData();
  }

  /**
   * Remove color at the given index.
   *
   * @param i Color index
   */
  public removeColor(i: number): void {
    if (this._colors.length > 2) {
      this._colors = this._colors.slice(0, i).concat(this._colors.slice(i + 1));

      this.updateData();
    }
  }


  /**
   * Bind vertex array object.
   */
  public bind(): void {
    if (this._status) this.gl.bindVertexArray(this._vao);
  }

  /**
   * Draw points array with the given program and
   *
   * @param getLocation Uniform location getter
   * @param draw Draw function
   * @param hightlight Hightlight points
   */
  public drawPoints(getLocation: UniformLocationGetter, draw: DrawFunction): void {
    const size = getLocation(`u_size`);
    const color = getLocation(`u_color`);
    const position = getLocation(`u_position`);

    this._colors.forEach(({ rgb, drawPoint, hightlightPoint }, i) => {
      if (drawPoint) {
        const near = i === this._nearest;
        const far = i === this._farthest;

        this.gl.uniform3fv(position, GLSLPoints.toSpace(rgb));

        if (hightlightPoint) {
          this.drawHightlight(draw, color, size, near ? GREEN : far ? RED : WHITE);
        }

        this.gl.uniform1f(size, this.size);
        this.gl.uniform3fv(color, rgb);
        draw();
      }
    });

    if (this.drawTarget) {
      this.gl.uniform3fv(position, GLSLPoints.toSpace(this._target));

      if (this.hightlightTargetPoint) {
        this.drawHightlight(draw, color, size, BLUE);
      }

      this.gl.uniform1f(size, this.size);
      this.gl.uniform3fv(color, this._target);
      draw();
    }
  }

  /**
   * Draw point at the given index with the given program and
   *
   * @param getLocation Uniform location getter
   * @param model Model
   * @param i Color index
   */
  public drawPoint(getLocation: UniformLocationGetter, draw: DrawFunction, i: number | `target`): void {
    const rgb = i === `target` ? {
      rgb: this._target,
      hightlightPoint: this.hightlightTargetPoint,
      border: BLUE
    } : {
      ...this._colors[i],
      border: i === this._nearest ? GREEN : i === this._farthest ? RED : WHITE
    };

    const size = getLocation(`u_size`);
    const color = getLocation(`u_color`);

    this.gl.uniform3fv(getLocation(`u_position`), GLSLPoints.toSpace(rgb.rgb));

    if (rgb.hightlightPoint) {
      this.drawHightlight(draw, color, size, rgb.border);
    }

    this.gl.uniform1f(size, this.size);
    this.gl.uniform3fv(color, rgb.rgb);
    draw();
  }

  /**
   * Draw distance array at the given index.
   *
   * @param getLocation Uniform location getter
   * @param i Color index
   * @param saturation Saturation
   */
  public drawDistance(getLocation: UniformLocationGetter, i: number, saturation = 0): void {
    const offset = i * 8;

    const draw = () => {
      this.gl.drawElements(this.gl.LINES, 2, this.gl.UNSIGNED_INT, offset);
    };


    if (this._colors[i].hightlightDistance) {
      const step = 1 / 1024;
      const vec = [ -step, -step, -step ];

      const position = getLocation(`u_position`);
      const rgb = getLocation(`u_rgb`);

      this.gl.uniform1f(rgb, 0);

      for (let i = 0; i < 9; ++i) {
        if (i !== 5) {
          this.gl.uniform3fv(position, vec);
          draw();
        }

        vec[i % 3] += step;
      }

      this.gl.uniform3fv(position, [ 0, 0, 0 ]);
      this.gl.uniform1f(rgb, saturation);
    }

    draw();
  }

  /**
   * Draw distances array.
   *
   * @param getLocation Uniform location getter
   * @param saturation Saturation
   */
  public drawDistances(getLocation: UniformLocationGetter, saturation = 0): void {
    this._colors.forEach(({ drawDistance }, i) => {
      if (drawDistance) {
        this.drawDistance(getLocation, i, saturation);
      }
    });
  }

  /**
   * Release points resources.
   */
  public delete(): void {
    this.gl.deleteBuffer(this._vbo);
    this.gl.deleteVertexArray(this._vao);

    delete this._status;
  }
}
