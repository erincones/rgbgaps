import { InputHTMLAttributes } from "react";
import { toHex, toRGBString, BLACK, RGB, RGBFormat } from "../../helpers/color";

import { Checkbox } from "./checkbox";


/**
 * Color properties
 */
interface Props {
  readonly id?: InputHTMLAttributes<HTMLInputElement>["id"];
  readonly name?: InputHTMLAttributes<HTMLInputElement>["name"];
  readonly label?: string;
  readonly distance?: number;
  readonly format?: RGBFormat;
  readonly disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"];
  readonly value?: RGB;
  readonly hightlighted?: InputHTMLAttributes<HTMLInputElement>["checked"];
  readonly distanced?: InputHTMLAttributes<HTMLInputElement>["checked"];
  readonly onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  readonly onHightlightedChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  readonly onDistancedChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}


/**
 * Color component
 *
 * @param param0 Color properties
 */
export const Color = ({ id, name, label, distance, format = `hex`, disabled, value, hightlighted, distanced, onChange, onHightlightedChange, onDistancedChange }: Props): JSX.Element => {
  // Return color
  return (
    <>
      {(label !== undefined) && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <div className={(label !== undefined) ? `pl-2` : undefined}>
        <div className="flex items-center space-x-2">
          <input id={id} name={name} type="color" disabled={disabled} value={value ? toHex(value) : undefined} onChange={onChange} className="border disabled:border-0 border-blueGray-800 shadow focus:outline-none focus:ring w-4 h-4" />
          <div className="text-xs leading-none">
            <span className="block flex-grow font-mono select-text whitespace-pre">
              {toRGBString(value || BLACK, format)}
            </span>

            {(distance !== undefined) && (
              <span className="block">
                Distance:
                <span className="font-mono select-text whitespace-pre ml-2">
                  {distance.toFixed(2).padStart(6)}%
                </span>
              </span>
            )}
          </div>

          {onHightlightedChange && <Checkbox id={id && `${id}-hightlight`} name={name && `${name}-hightlight`} checked={hightlighted} onChange={onHightlightedChange} />}
          {onDistancedChange && <Checkbox id={id && `${id}-distance`} name={name && `${name}-distance`} checked={distanced} onChange={onHightlightedChange} />}
        </div>
      </div>
    </>
  );
};
