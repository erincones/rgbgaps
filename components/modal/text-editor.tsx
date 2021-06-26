import { useState, useEffect, Dispatch, SetStateAction, ChangeEventHandler } from "react";

import { toRGB, toRGBString, RGB, RGBFormat } from "../../lib/color";

import { CanvasState, CanvasAction } from "../../reducers/canvas";

import { Header } from "../header";
import { Radio } from "../sidebar/radio";
import { Button } from "../sidebar/button";
import { Modal } from ".";


/**
 * Text editor properties
 */
interface Props {
  readonly open?: boolean;
  readonly state: CanvasState;
  readonly format?: RGBFormat;
  readonly dispatch: Dispatch<CanvasAction>;
  readonly setFormat?: Dispatch<SetStateAction<RGBFormat>>;
  readonly onClose?: () => void;
}


/**
 * Text editor component
 *
 * @param props Text editor properties
 */
export const TextEditor = ({ open, state, format, dispatch, setFormat, onClose }: Props): JSX.Element => {
  const [ text, setText ] = useState(``);
  const [ palette, setPalette ] = useState<ReadonlyArray<RGB>>();
  const [ error, setError ] = useState(false);

  const colors = state.points?.colors;


  // Parse palette format
  const formatPalette = (format: RGBFormat): void => {
    if (error || !setFormat || !palette) return;

    setFormat(format);
    setText(palette.map(rgb => toRGBString(rgb, format)).join(`\n`));
  };

  // Text change handler
  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    const lines = e.target.value
      .split(`\n`)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const palette: RGB[] = [];
    let error = false;

    for (const line of lines) {
      const rgb = toRGB(line, format);

      if (rgb === null) {
        error = true;
        break;
      }

      palette.push(rgb);
    }


    error = error || palette.length < 2;

    if (!error) setPalette(palette);

    setText(e.target.value);
    setError(error);
  };

  // Close handler
  const close = () => {
    setPalette(undefined);
    onClose?.();
  };

  // Accept handler
  const accept = () => {
    dispatch({ type: `SET_PALETTE`, palette: palette || [] });
    close();
  };


  // Update palette
  useEffect(() => {
    if (!palette && colors) {
      setText(colors.map(({ rgb }) => toRGBString(rgb, format)).join(`\n`));
      setPalette(colors.map(({ rgb }) => rgb));
    }
  }, [ palette, colors, format ]);


  // Return text editor
  return (
    <Modal open={open} onClose={close}>
      <Header onClose={close}>
        Palette
      </Header>
      <div className="p-4">
        <div>
          Format:
          <div className="grid grid-rows-2 grid-cols-2 pl-2">
            <Radio id="text-hex" name="text-format" label="Hexadecimal" checked={format === `hex`} onChange={() => { formatPalette(`hex`); }} />
            <Radio id="text-rgb" name="text-format" label="0..255" checked={format === `rgb`} onChange={() => { formatPalette(`rgb`); }} />
            <Radio id="text-pct" name="text-format" label="Percentage" checked={format === `pct`} onChange={() => { formatPalette(`pct`); }} />
            <Radio id="text-arith" name="text-format" label="0..1" checked={format === `arith`} onChange={() => { formatPalette(`arith`); }} />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between">
            <label htmlFor="palette">
              Palette:
            </label>
            <small className="text-blueGray-600">
              One color by line
            </small>
          </div>
          <div className="pl-2">
            <textarea
              id="palette"
              name="palette"
              rows={5}
              autoCapitalize="none"
              spellCheck={false}
              value={text}
              onChange={handleTextChange}
              className={`${error ? `border-red-500 focus:border-red-500 focus:ring-red-500 ` : `focus:ring-blue-500 `}text-sm font-mono leading-tight focus:ring focus:ring-offset-0 focus:ring-opacity-50 p-2 w-full`}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button disabled={error} onClick={accept}>
            Accept
          </Button>
          <Button onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
