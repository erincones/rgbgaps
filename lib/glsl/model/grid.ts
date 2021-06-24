import { GLSLObject } from "../object";


/**
 * GLSL grid.
 */
export class GLSLGrid extends GLSLObject<WebGL2RenderingContext> {
  /** Grid data */
  private _data: Readonly<Float32Array> = new Float32Array();

  /** Vertex array object */
  private _vao: WebGLVertexArrayObject | null;

  /** Vertex buffer object */
  private _vbo: WebGLBuffer | null;

  /** Grid size */
  private _size: number;


  /**
   * Creates a new grid.
   */
  constructor(gl: WebGL2RenderingContext, onerror?: ErrorHandler) {
    super(gl);

    this._size = 64;
    this._vao = gl.createVertexArray();

    if (this._vao === null) {
      this._vbo = null;
      this._status = false;

      GLSLObject.handleError(`could not create the VAO:\nunknown error`, onerror);
    }
    else {
      this._vbo = gl.createBuffer();

      if (this._vbo === null) {
        this._status = false;

        GLSLObject.handleError(`could not create the VBO:\nunknown error`, onerror);
      }
      else {
        this._status = true;

        gl.bindVertexArray(this._vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);

        this.size = this._size;
      }
    }
  }


  /** Grid data */
  public get data(): Readonly<Float32Array> {
    return this._data;
  }

  /** Vertex array object */
  public get vao(): WebGLVertexArrayObject | null {
    return this._vao;
  }

  /** Vertex buffer object */
  public get vbo(): WebGLBuffer | null {
    return this._vbo;
  }

  /** Grid size */
  public get size(): number {
    return this._size;
  }

  /** Grid size */
  public set size(size: number) {
    const step = Math.trunc(size) / 128;
    const data: number[][] = [ [], [], [] ];
    this._size = size;

    if (step > 0) {
      for (let i = -1; i <= 1; i += step) {
        for (let j = -1; j <= 1; j += step) {
          data[0].push(-1, i, j, 1, i, j);
          data[1].push(i, -1, j, i, 1, j);
          data[2].push(i, j, -1, i, j, 1);
        }
      }
    }

    this._data = new Float32Array(data.flat());

    if (this._status) {
      this.gl.bindVertexArray(this._vao);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this._data, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12, 0);
    }
  }

  /**
   * Bind vertex array object.
   */
  public bind(): void {
    if (this._status) this.gl.bindVertexArray(this._vao);
  }

  /**
   * Draw grid array.
   */
  public draw(): void {
    this.gl.drawArrays(this.gl.LINES, 0, this._data.length / 3);
  }

  /**
   * Draw grid x lines array.
   */
  public drawX(): void {
    this.gl.drawArrays(this.gl.LINES, 0, this._data.length / 9);
  }

  /**
   * Draw grid y lines array.
   */
  public drawY(): void {
    const size = this._data.length / 9;
    this.gl.drawArrays(this.gl.LINES, size, size);
  }

  /**
   * Draw grid z lines array.
   */
  public drawZ(): void {
    const size = this._data.length / 9;
    this.gl.drawArrays(this.gl.LINES, size * 2, size);
  }

  /**
   * Release grid resources.
   */
  public delete(): void {
    this.gl.deleteBuffer(this._vbo);
    this.gl.deleteVertexArray(this._vao);

    delete this._status;
  }
}
