/** Color type */
export type RGB = Readonly<[ number, number, number ]>;

/** Color format */
export type RGBFormat = `hex` | `rgb` | `arith` | `pct`;


/** Black */
export const BLACK: RGB = [ 0, 0, 0 ];

/** White */
export const WHITE: RGB = [ 1, 1, 1 ];

/** Red */
export const RED: RGB = [ 1, 0, 0 ];

/** Green */
export const GREEN: RGB = [ 0, 1, 0 ];

/** Blue */
export const BLUE: RGB = [ 0, 0, 1 ];


/** Hexadecimal regex */
const HEX = /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/;

/** Hexadecimal short regex */
const HEX_SHORT = /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/;


/**
 * Parse hexadecimal color to RGB color.
 *
 * @param hex Hexadecimal color
 * @returns RGBA color
 */
export const toRGB = (hex: string): RGB | null => {
  const color = hex.match(HEX) || hex.match(HEX_SHORT);
  return color && color.slice(1).map(ch => Number.parseInt(ch.length === 1 ? `${ch}${ch}` : ch, 16) / 255) as never;
};

/**
 * Parse RGB color to hexadecimal color.
 *
 * @param rgb RGB color
 * @returns Hexadecimal color
 */
export const toHex = (rgb: RGB): string => {
  return rgb.reduce((hex, ch) => hex + Math.trunc(ch * 255).toString(16).toUpperCase().padStart(2, `0`), `#`);
};


/**
 * Parse RGB color to arithmetic string.
 *
 * @param rgb RGB color
 * @returns Arithmetic string color
 */
export const toRGBArithmetic = (rgb: RGB): string => {
  return `( ${rgb.map(ch => ch.toFixed(4)).join(`, `)} )`;
};

/**
 * Parse RGB color to percentage string.
 *
 * @param rgb RGB color
 * @returns Percentage string color
 */
export const toRGBPercentage = (rgb: RGB): string => {
  return `( ${rgb.map(ch => (ch * 100).toFixed(2).padStart(6) + `%`).join(`, `)} )`;
};

/**
 * Parse RGB color to string.
 *
 * @param rgb RGB color
 * @returns String color
 */
export const toRGBString = (rgb: RGB, format: RGBFormat = `rgb`): string => {
  switch (format) {
    case `hex`:   return toHex(rgb);
    case `rgb`:   return `( ${rgb.map(ch => Math.trunc(ch * 255).toString().padStart(3)).join(`, `)} )`;
    case `arith`: return toRGBArithmetic(rgb);
    case `pct`:   return toRGBPercentage(rgb);
  }
};
