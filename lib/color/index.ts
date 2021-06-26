/** Color type */
export type RGB = Readonly<[ number, number, number ]>;

/** Color format */
export type RGBFormat = `hex` | `rgb` | `arith` | `pct`;


/** Black */
export const BLACK: RGB = [ 0, 0, 0 ];

/** White */
export const WHITE: RGB = [ 1, 1, 1 ];

/** Gray */
export const GRAY: RGB = [ 0.5, 0.5, 0.5 ];

/** Red */
export const RED: RGB = [ 1, 0, 0 ];

/** Green */
export const GREEN: RGB = [ 0, 1, 0 ];

/** Blue */
export const BLUE: RGB = [ 0, 0, 1 ];


/** Hexadecimal regex */
const HEX = /^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/;

/** Hexadecimal short regex */
const HEX_SHORT = /^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/;

/** Triplet regex */
const TRIPLET = /^\(?\s*([\w.%]+)\s*,\s*([\w.%]+)\s*,\s*([\w.%]+)\s*\)?$/;

/** Parentheses regex */
const PARENTHESES = /^\(.*\)$|^[^(](?:.*[^)])?/;


/**
 * Parse string color to RGB color.
 *
 * @param str String color
 * @returns RGBA color
 */
export const toRGB = (str: string, format: RGBFormat = `hex`): RGB | null => {
  let match: RegExpMatchArray | null = null;
  let rgb: number[];

  switch (format) {
    case `rgb`:
      match = str.match(TRIPLET);

      if (!match || !PARENTHESES.test(str)) return null;

      rgb = match.slice(1).map(c => {
        const int = parseInt(c);
        const float = parseFloat(c);

        return int === float ? int / 255 : Number.NaN;
      });

      return rgb.some(c => isNaN(c)) ? null : rgb as never;

    case `arith`:
      match = str.match(TRIPLET);

      if (!match || !PARENTHESES.test(str)) return null;

      rgb = match.slice(1).map(c => parseFloat(c) / 255);

      return rgb.some(c => isNaN(c)) ? null : rgb as never;

    case `pct`:
      match = str.match(TRIPLET);

      if (!match || !PARENTHESES.test(str)) return null;

      rgb = match.slice(1).map(c => parseFloat(c.slice(0, -1)) / 25500);

      return rgb.some(c => isNaN(c)) ? null : rgb as never;

    default:
      match = str.match(HEX);

      if (match) {
        return match.slice(1).map(c => parseInt(c, 16) / 255) as never;
      }

      match = str.match(HEX_SHORT);

      if (match) {
        return match.slice(1).map(c => parseInt(c + c, 16) / 255) as never;
      }

      return null;
  }
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


/**
 * Get a random RGB color.
 *
 * @returns Random RGB
 */
export const randRGB = (): RGB => {
  return [ Math.random(), Math.random(), Math.random() ];
};

/**
 * Get the distance between two colors.
 *
 * @param p First color
 * @param q Second color
 * @returns Distance between the given colors
 */
export const distanceRGB = (p: RGB, q: RGB): number => {
  const r = p[0] - q[0];
  const g = p[1] - q[1];
  const b = p[2] - q[2];

  return Math.sqrt(r * r + g * g + b * b);
};
