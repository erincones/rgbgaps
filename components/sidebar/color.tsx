import { InputHTMLAttributes, ButtonHTMLAttributes } from "react";

import { toHex, toRGBString, BLACK, RGB, RGBFormat } from "../../lib/color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toggler } from "./toggler";


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
  readonly drawPoint?: boolean;
  readonly drawDistance?: boolean;
  readonly hightlightPoint?: boolean;
  readonly hightlightDistance?: boolean;
  readonly onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  readonly onPointModeClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  readonly onDistanceModeClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  readonly onRemoveClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/** Maximum distance */
const DISTANCE_FACTOR = 100 / Math.sqrt(3);


/**
 * Color component
 *
 * @param param0 Color properties
 */
export const Color = ({ id, name, label, format = `hex`, disabled, value, distance, note, drawPoint, drawDistance, hightlightPoint, hightlightDistance, onChange, onPointModeClick, onDistanceModeClick, onRemoveClick }: Props): JSX.Element => {
  // Return color
  return (
    <>
      {(label !== undefined) && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <div className={(label !== undefined) ? `pl-2` : undefined}>
        <div className="flex items-center space-x-1">
          <input id={id} name={name} type="color" disabled={disabled} readOnly={disabled} value={value ? toHex(value) : undefined} onChange={onChange} className="border disabled:border-0 border-blueGray-800 shadow focus:outline-none focus:ring w-4 h-4" />
          <div className="flex-grow text-xs leading-none">
            <span className="block flex-grow font-mono select-text whitespace-pre">
              {toRGBString(value || BLACK, format)}
            </span>

            {(distance !== undefined) && (
              <span>
                Distance:
                <span className="font-mono select-text whitespace-pre mx-2">
                  {(distance * DISTANCE_FACTOR).toFixed(2).padStart(6)}%
                </span>
              </span>
            )}
            {note && <strong>{note}</strong>}
          </div>

          {onRemoveClick && (
            <button type="button" title="Remove color" onClick={onRemoveClick} className="flex justify-center items-center bg-red-500 hover:bg-red-600 border border-blueGray-800 shadow focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50 w-4 h-4">
              <FontAwesomeIcon icon="times" fixedWidth className="text-white text-xs" />
            </button>
          )}
          {onPointModeClick && (
            <Toggler
              id={id && `${id}-point-mode`}
              name={name && `${name}-point-mode`}
              icon={hightlightPoint ? `check-double` : drawPoint ? `check` : undefined}
              onClick={onPointModeClick}
            />
          )}
          {onDistanceModeClick && (
            <Toggler
              id={id && `${id}-distance-mode`}
              name={name && `${name}-distance-mode`}
              icon={hightlightDistance ? `check-double` : drawDistance ? `check` : undefined}
              onClick={onDistanceModeClick}
            />
          )}
          {onPointModeClick && !onDistanceModeClick && <div className="invisible w-4" />}
        </div>
      </div>
    </>
  );
};
