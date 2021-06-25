import { InputHTMLAttributes } from "react";
import { toHex, toRGBString, BLACK, RGB, RGBFormat } from "../../lib/color";

import { Checkbox } from "./checkbox";


/**
 * Color properties
 */
interface Props {
  readonly id?: InputHTMLAttributes<HTMLInputElement>["id"];
  readonly name?: InputHTMLAttributes<HTMLInputElement>["name"];
  readonly label?: string;
  readonly format?: RGBFormat;
  readonly disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"];
  readonly value?: RGB;
  readonly distance?: number;
  readonly note?: string;
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
export const Color = ({ id, name, label, format = `hex`, disabled, value, distance, note, hightlighted, distanced, onChange, onHightlightedChange, onDistancedChange }: Props): JSX.Element => {
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
          <input id={id} name={name} type="color" disabled={disabled} readOnly={disabled} value={value ? toHex(value) : undefined} onChange={onChange} className="border disabled:border-0 border-blueGray-800 shadow focus:outline-none focus:ring w-4 h-4" />
          <div className="flex-grow text-xs leading-none">
            <span className="block flex-grow font-mono select-text whitespace-pre">
              {toRGBString(value || BLACK, format)}
            </span>

            {(distance !== undefined) && (
              <span>
                Distance:
                <span className="font-mono select-text whitespace-pre mx-2">
                  {distance.toFixed(2).padStart(6)}%
                </span>
              </span>
            )}
            {note && <strong>{note}</strong>}
          </div>

          {onHightlightedChange && <Checkbox id={id && `${id}-hightlight`} name={name && `${name}-hightlight`} checked={hightlighted} onChange={onHightlightedChange} />}
          {onDistancedChange && <Checkbox id={id && `${id}-distance`} name={name && `${name}-distance`} checked={distanced} onChange={onDistancedChange} />}
          {onHightlightedChange && !onDistancedChange && <input type="checkbox" className="invisible" />}
        </div>
      </div>
    </>
  );
};
