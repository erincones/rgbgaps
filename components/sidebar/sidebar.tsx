import { useState, Dispatch } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";
import { RGBFormat } from "../../helpers/color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section } from "./section";
import { Subsection } from "./subsection";
import { Button } from "./button";
import { Radio } from "./radio";
import { Checkbox } from "./checkbox";
import { Vector } from "./vector";
import { Color } from "./color";


/**
 * Sidebar component properties
 */
 interface Props {
  readonly state: CanvasState;
  readonly dispatch: Dispatch<CanvasAction>;
}


/**
 * Sidebar component
 *
 * @param props Sidebar properties
 */
export const Sidebar = ({ state, dispatch }: Props): JSX.Element => {
  const [ format, setFormat ] = useState<RGBFormat>(`hex`);

  const { camera } = state;


  // Return sidebar
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 overflow-auto md:w-80 h-1/3 md:h-auto">
      <Section title="Camera">
        <li>
          <div>
            <label htmlFor="fov" className="inline-block w-1/4">
              FOV:
            </label>
            <span className="font-mono select-text tabular-nums ml-2">
              {camera.fov.toFixed(2)}°
            </span>
          </div>
          <input id="fov" name="fov" type="range" value={camera.fov} min={camera.fovMin} max={camera.fovMax} step="0.01" onChange={e => { dispatch({ type: `SCALE`, fov: Number(e.target.value) }); }} className="w-full" />
        </li>
        <li>
          <span className="inline-block w-1/4">
            Position:
          </span>
          <Vector vec={camera.position} />
        </li>
        <li>
          <span className="inline-block w-1/4">
            Direction:
          </span>
          <Vector vec={camera.front} />
        </li>
        <li>
          Projection:
          <div className="pl-2">
            <Radio id="persp" name="projection" label="Perspective" checked={camera.projection === `perspective`} onChange={() => { dispatch({ type: `TOGGLE_PROJECTION` }); }} />
            <Radio id="ortho" name="projection" label="Orthogonal" checked={camera.projection === `orthogonal`} onChange={() => { dispatch({ type: `TOGGLE_PROJECTION` }); }} />
          </div>
        </li>
        <li className="text-right">
          <Button title="Reset camera" onClick={() => { dispatch({ type: `RESET_CAMERA` }); }}>
            Reset
          </Button>
        </li>
      </Section>

      <Section title="Cube">
        <li>
          <div>
            <label htmlFor="opacity" className="inline-block w-1/4">
              Opacity:
            </label>
            <span className="font-mono select-text tabular-nums ml-2">
              {(state.opacity * 100).toFixed(0)}%
            </span>
          </div>
          <input name="opacity" type="range" value={state.opacity} min={0} max={1} step="0.01" onChange={e => { dispatch({ type: `SET_OPACITY`, opacity: Number(e.target.value) }); }} className="w-full" />
        </li>
        <li>
          Guides:
          <div className="grid grid-rows-2 grid-cols-2 pl-2">
            <Checkbox id="axis" name="axis" label="Axis" />
            <Checkbox id="grid" name="grid" label="Grid" />
            <Checkbox id="diagonal" name="diagonal" label="Diagonal" />
          </div>
        </li>
      </Section>

      <Section title="Colors" defaultOpen>
        <li>
          Format:
          <div className="grid grid-rows-2 grid-cols-2 pl-2">
            <Radio id="hex" name="format" label="Hexadecimal" checked={format === `hex`} onChange={() => { setFormat(`hex`); }} />
            <Radio id="rgb" name="format" label="0..255" checked={format === `rgb`} onChange={() => { setFormat(`rgb`); }} />
            <Radio id="pct" name="format" label="Percentage" checked={format === `pct`} onChange={() => { setFormat(`pct`); }} />
            <Radio id="arith" name="format" label="0..1" checked={format === `arith`} onChange={() => { setFormat(`arith`); }} />
          </div>
        </li>
        <li>
          <div className="flex items-end space-x-2">
            <span className="flex-grow">
              Hightlight:
            </span>
            <label htmlFor="all-hightlighted" title="Colors" className="flex flex-col items-center space-y-0.5">
              <FontAwesomeIcon icon="bullseye" fixedWidth />
              <Checkbox id="all-hightlighted" name="all-hightlighted" />
            </label>
            <label htmlFor="all-distanced" title="Distances" className="flex flex-col items-center space-y-0.5">
              <FontAwesomeIcon icon="route" fixedWidth />
              <Checkbox id="all-distanced" name="all-distanced" />
            </label>
          </div>
        </li>
        <li>
          <Color id="target" name="target" format={format} label="Target:" />
        </li>
        <li>
          <Color id="nearest" name="nearest" format={format} label="Nearest:" disabled />
        </li>
        <Subsection title="Palette" defaultOpen>
          <li>
            <ul className="flex space-x-2">
              <li>
                <Button title="Text editor" onClick={undefined}>
                  Raw
                </Button>
              </li>
              <li className="flex-grow text-right">
                <Button title="Export current" onClick={undefined}>
                  Export
                </Button>
              </li>
              <li>
                <Button title="Import" onClick={undefined}>
                  Import
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <Color format={format} />
          </li>
        </Subsection>
      </Section>
    </ul>
  );
};
