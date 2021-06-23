import { vec2, vec3, vec4 } from "gl-matrix";


/**
 * Vector properties
 */
interface Props {
  readonly vec: vec2 | vec3 | vec4;
}


/**
 * Vector component
 *
 * @param props Vector properties
 */
export const Vector = ({ vec }: Props): JSX.Element => {
  const fixed: string[] = [];

  vec.forEach(e => {
    const number = e.toFixed(2);
    fixed.push(e < 0 ? number : ` ${number}`);
  });

  // Return vector
  return (
    <span className="font-mono select-text tabular-nums whitespace-pre ml-2">
      [ {fixed.join(`, `)} ]
    </span>
  );
};
