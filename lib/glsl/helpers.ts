import { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } from "gl-matrix";

/** Generic matrix type */
type mat = typeof mat2 | typeof mat2d | typeof mat3 | typeof mat4 | typeof quat | typeof quat2 | typeof vec2 | typeof vec3 | typeof vec4;

/** Angle converter */
const ANGLE_CONV = Math.PI / 180;


/**
 * Convert degrees to radians.
 *
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
export const toRad = (deg: number): number => deg * ANGLE_CONV;

/**
 * Convert radians to degrees.
 *
 * @param deg Angle in radians
 * @returns Angle in degrees
 */
export const toDeg = (rad: number): number => rad / ANGLE_CONV;


/**
 * Copy the field from source to destiny.
 *
 * @param dst Destiny
 * @param src Source
 * @param field Field
 * @param mat Matrix type
 */
export const merge = <T extends Record<string, unknown>, K extends keyof T>(dst: T, src: T, field: K, mat?: mat): void => {
  const val = src[field];

  if (val !== undefined && val !== dst[field]) {
    if (mat) mat.copy(dst[field] as never, val as never);
    else dst[field] = val;
  }
};
