import { GLSLObject } from "../object";


/**
 * GLSL points.
 */
export class GLSLPoints extends GLSLObject<WebGL2RenderingContext> {
  /** Points data */
  public static readonly data: Readonly<Float32Array> = new Float32Array([
    -1, -1, -1,
    1.15, -1, -1,
    1.05, -0.95, -1,
    1.05, -1.05, -1,
    -1, 1.15, -1,
    -0.95, 1.05, -1,
    -1.05, 1.05, -1,
    -1, -1, 1.15,
    -1, -0.95, 1.05,
    -1, -1.05, 1.05,
  ]);

  /** Points index */
  public static readonly index: Readonly<Uint8Array> = new Uint8Array([
    0, 1,
    0, 4,
    0, 7,
    2, 1, 3,
    5, 4, 6,
    8, 7, 9
  ]);


  /** Vertex array object */
  private _vao: WebGLVertexArrayObject | null;

  /** Vertex buffer object */
  private _vbo: WebGLBuffer | null;

  /** Element buffer object */
  private _ebo: WebGLBuffer | null;


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
        gl.bufferData(gl.ARRAY_BUFFER, GLSLPoints.data, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, GLSLPoints.index, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
      }
    }
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
   * Bind vertex array object.
   */
  public bind(): void {
    if (this._status) this.gl.bindVertexArray(this._vao);
  }

  /**
   * Draw points elements.
   */
  public draw(): void {
    console.log(`draw points and distances`);
  }

  /**
   * Draw only point elements.
   */
  public drawPoints(): void {
    console.log(`draw points`);
  }

  /**
   * Draw only distance elements.
   */
  public drawDistances(): void {
    console.log(`draw distances`);
  }

  /**
   * Release points resources.
   */
  public delete(): void {
    this.gl.deleteBuffer(this._ebo);
    this.gl.deleteBuffer(this._vbo);
    this.gl.deleteVertexArray(this._vao);

    delete this._status;
  }
}
