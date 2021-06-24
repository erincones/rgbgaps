import { useState, Dispatch } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";
import { RGBFormat } from "../../lib/color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section } from "./section";
import { Subsection } from "./subsection";
import { Button } from "./button";
import { Radio } from "./radio";
import { Checkbox } from "./checkbox";
import { Range } from "./range";
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
  const persp = camera.projection === `perspective`;


  // Return sidebar
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 overflow-auto md:w-80 h-1/3 md:h-auto">
      <Section title="Camera">
        <li>
          <Range
            id="fov"
            name="fov"
            label="FOV:"
            value={camera.fov}
            span={`${camera.fov.toFixed(2).padStart(6)}%`}
            min={camera.fovMin}
            max={camera.fovMax}
            step="0.01"
            onChange={e => { dispatch({ type: `SCALE`, fov: Number(e.target.value) }); }}
          />
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
          <div className="grid grid-cols-2 pl-2">
            <Radio id="persp" name="projection" label="Perspective" checked={persp} onChange={e => { dispatch({ type: `SET_PROJECTION`, projection: e.target.checked ? `perspective` : `orthogonal` }); }} />
            <Radio id="ortho" name="projection" label="Orthogonal" checked={!persp} onChange={e => { dispatch({ type: `SET_PROJECTION`, projection: e.target.checked ? `orthogonal` : `perspective` }); }} />
          </div>
        </li>
        <li className="text-right">
          <Button title="Reset camera" onClick={() => { dispatch({ type: `RESET_CAMERA` }); }}>
            Reset
          </Button>
        </li>
      </Section>

      <Section title="Render">
        <li>
          <Color id="background" name="background" format={format} label="Background:" value={state.background} onChange={e => { dispatch({ type: `SET_BACKGROUND`, background: e.target.value }); }} />
        </li>
        <li>
          Draw:
          <div className="grid grid-rows-2 grid-cols-2 pl-2">
            <Checkbox id="cube" name="axis" label="Cube" checked={state.drawCube} onChange={e => { dispatch({ type: `SET_DRAW`, model: `CUBE`, status: e.target.checked }); }} />
            <Checkbox id="axis" name="axis" label="Axis" checked={state.drawAxis} onChange={e => { dispatch({ type: `SET_DRAW`, model: `AXIS`, status: e.target.checked }); }} />
            <Checkbox id="diag" name="diag" label="Diagonal" checked={state.drawDiagonal} onChange={e => { dispatch({ type: `SET_DRAW`, model: `DIAG`, status: e.target.checked }); }} />
            <Checkbox id="grid" name="grid" label="Grid" checked={state.drawGrid} onChange={e => { dispatch({ type: `SET_DRAW`, model: `GRID`, status: e.target.checked }); }} />
          </div>
        </li>
        <Subsection title="Opacity">
          <li>
            <Range
              id="alpha-in"
              name="alpha-in"
              label="Cube inside:"
              value={state.alphaIn}
              span={`${(state.alphaIn * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `IN`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-out"
              name="alpha-out"
              label="Cube outside:"
              value={state.alphaOut}
              span={`${(state.alphaOut * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `OUT`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-axis"
              name="alpha-axis"
              label="Axis:"
              value={state.alphaAxis}
              span={`${(state.alphaAxis * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `AXIS`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-grid"
              name="alpha-grid"
              label="Grid:"
              value={state.alphaGrid}
              span={`${(state.alphaGrid * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `GRID`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-diag"
              name="alpha-diag"
              label="Diagonal:"
              value={state.alphaDiagonal}
              span={`${(state.alphaDiagonal * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `DIAG`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-points"
              name="alpha-points"
              label="Points:"
              value={state.alphaPoints}
              span={`${(state.alphaPoints * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `POINTS`, opacity: Number(e.target.value) }); }}
            />
          </li>
          <li>
            <Range
              id="alpha-dists"
              name="alpha-dists"
              label="Distances:"
              value={state.alphaDistances}
              span={`${(state.alphaDistances * 100).toFixed(0).padStart(3)}%`}
              min="0"
              max="1"
              step="0.01"
              onChange={e => { dispatch({ type: `SET_ALPHA`, model: `DISTS`, opacity: Number(e.target.value) }); }}
            />
          </li>
        </Subsection>
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
