import { useState, Dispatch } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";
import { RGBFormat, toHex } from "../../lib/color";

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

  const { camera, points } = state;
  const persp = camera.projection === `perspective`;
  const nearest = points?.nearest;
  const farthest = points?.farthest;

  // Return sidebar
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 overflow-auto md:w-88 h-1/3 md:h-auto">
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
        <li className="mb-1">
          Projection:
          <div className="grid grid-cols-2 pl-2">
            <Radio id="persp" name="projection" label="Perspective" checked={persp} onChange={e => { dispatch({ type: `SET_PROJECTION`, projection: e.target.checked ? `perspective` : `orthogonal` }); }} />
            <Radio id="ortho" name="projection" label="Orthogonal" checked={!persp} onChange={e => { dispatch({ type: `SET_PROJECTION`, projection: e.target.checked ? `orthogonal` : `perspective` }); }} />
          </div>
        </li>
        <li>
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
        <li>
          Color point:
          <div className="pl-2">
            <Range
              id="point-size"
              name="point-size"
              label="Size:"
              value={points?.size * 256}
              span={(points?.size * 256).toFixed().padStart(3)}
              min="1"
              max="256"
              onChange={e => { dispatch({ type: `SET_POINT_SIZE`, size: Number(e.target.value) / 256 }); }}
            />
          </div>
        </li>
        <li>
          Grid:
          <div className="pl-2">
            <div>
              <Range
                id="grid-size"
                name="grid-size"
                label="Size:"
                value={state.grid?.size}
                span={state.grid?.size.toFixed().padStart(3)}
                min="16"
                max="256"
                onChange={e => { dispatch({ type: `SET_GRID_SIZE`, size: Number(e.target.value) }); }}
              />
            </div>
            <div>
              <Range
                id="grid-gap"
                name="grid-gap"
                label="Dash length:"
                value={state.gapGrid}
                span={state.gapGrid.toFixed().padStart(3)}
                min="0"
                max="256"
                onChange={e => { dispatch({ type: `SET_GRID_GAP`, gap: Number(e.target.value) }); }}
              />
            </div>
          </div>
        </li>
        <Subsection title="Line color">
          <li className="flex justify-end text-center">
            <span className="w-1/3">RGB</span>
            <span className="w-1/3">Black</span>
          </li>
          <li className="flex">
            <span className="w-1/3">
              Axis:
            </span>
            <div className="flex justify-center w-1/3">
              <Radio id="axis-rgb" name="color-axis" title="RGB" checked={state.colorAxis === `rgb`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `AXIS`, mode: e.target.checked ? `rgb` : `black` }); }}/>
            </div>
            <div className="flex justify-center w-1/3">
              <Radio id="axis-black" name="color-axis" title="Black" checked={state.colorAxis === `black`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `AXIS`, mode: e.target.checked ? `black` : `rgb` }); }}/>
            </div>
          </li>
          <li className="flex">
            <span className="w-1/3">
              Grid:
            </span>
            <div className="flex justify-center w-1/3">
              <Radio id="grid-rgb" name="color-grid" title="RGB" checked={state.colorGrid === `rgb`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `GRID`, mode: e.target.checked ? `rgb` : `black` }); }}/>
            </div>
            <div className="flex justify-center w-1/3">
              <Radio id="grid-black" name="color-grid" title="Black" checked={state.colorGrid === `black`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `GRID`, mode: e.target.checked ? `black` : `rgb` }); }}/>
            </div>
          </li>
          <li className="flex">
            <span className="w-1/3">
              Diagonal:
            </span>
            <div className="flex justify-center w-1/3">
              <Radio id="diag-rgb" name="color-diag" title="RGB" checked={state.colorDiagonal === `rgb`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `DIAG`, mode: e.target.checked ? `rgb` : `black` }); }}/>
            </div>
            <div className="flex justify-center w-1/3">
              <Radio id="diag-black" name="color-diag" title="Black" checked={state.colorDiagonal === `black`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `DIAG`, mode: e.target.checked ? `black` : `rgb` }); }}/>
            </div>
          </li>
          <li className="flex">
            <span className="w-1/3">
              Points:
            </span>
            <div className="flex justify-center w-1/3">
              <Radio id="points-rgb" name="color-points" title="RGB" checked={state.colorPoints === `rgb`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `POINTS`, mode: e.target.checked ? `rgb` : `black` }); }}/>
            </div>
            <div className="flex justify-center w-1/3">
              <Radio id="points-black" name="color-points" title="Black" checked={state.colorPoints === `black`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `POINTS`, mode: e.target.checked ? `black` : `rgb` }); }}/>
            </div>
          </li>
          <li className="flex">
            <span className="w-1/3">
              Distances:
            </span>
            <div className="flex justify-center w-1/3">
              <Radio id="dists-rgb" name="color-dists" title="RGB" checked={state.colorDistances === `rgb`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `DISTS`, mode: e.target.checked ? `rgb` : `black` }); }}/>
            </div>
            <div className="flex justify-center w-1/3">
              <Radio id="dists-black" name="color-dists" title="Black" checked={state.colorDistances === `black`} onChange={e => { dispatch({ type: `SET_SATURATION`, model: `DISTS`, mode: e.target.checked ? `black` : `rgb` }); }}/>
            </div>
          </li>
        </Subsection>
        <hr />
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
          <div className="flex justify-end space-x-1.5">
            <label htmlFor="all-hightlighted" title="Points mode" className="flex flex-col items-center space-y-0.5">
              <FontAwesomeIcon icon="bullseye" fixedWidth />
              <Checkbox
                id="all-hightlighted"
                name="all-hightlighted"
                checked={points?.hightlightedAllPoints()}
                onChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, status: e.target.checked }); }}
              />
            </label>
            <label htmlFor="all-distanced" title="Distances mode" className="flex flex-col items-center space-y-0.5">
              <FontAwesomeIcon icon="route" fixedWidth />
              <Checkbox
                id="all-distanced"
                name="all-distanced"
                checked={points?.hightlightedAllDistances()}
                onChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, status: e.target.checked }); }}
              />
            </label>
          </div>
        </li>
        <li>
          <Color
            id="target"
            name="target"
            format={format}
            label="Target:"
            value={points?.target}
            hightlighted={points?.hightlightTargetPoint}
            onChange={e => { dispatch({ type: `SET_COLOR`, index: `target`, color: e.target.value }); }}
            onHightlightedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: `target`, status: e.target.checked }); }}
          />
        </li>
        <li>
          <Color
            id="nearest"
            name="nearest"
            format={format}
            label="Nearest:"
            value={nearest?.rgb}
            distance={nearest?.distance * 100}
            hightlighted={nearest?.hightlightPoint}
            distanced={nearest?.hightlightDistance}
            disabled
            onHightlightedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: points?.nearestIndex, status: e.target.checked }); }}
            onDistancedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, index: points?.nearestIndex, status: e.target.checked }); }}
          />
        </li>
        <li>
          <Color
            id="farthest"
            name="farthest"
            format={format}
            label="Farthtest:"
            value={farthest?.rgb}
            distance={farthest?.distance * 100}
            hightlighted={farthest?.hightlightPoint}
            distanced={farthest?.hightlightDistance}
            disabled
            onHightlightedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: points?.farthestIndex, status: e.target.checked }); }}
            onDistancedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, index: points?.farthestIndex, status: e.target.checked }); }}
          />
        </li>
        <hr className="mt-1" />
        <Subsection title="Palette" defaultOpen>
          <li className="mb-1">
            <Button onClick={undefined}>
              Text editor
            </Button>
          </li>
          {points?.colors.map(({ rgb, distance, hightlightPoint, hightlightDistance }, i) => {
            const id = `${toHex(rgb)}-${i}`;
            const note =
              i === points.nearestIndex ? `Nearest` :
              i === points.farthestIndex ? `Farthest` :
              undefined;

            return (
              <li key={i} className="mb-1">
                <Color
                  id={id}
                  name={id}
                  format={format}
                  value={rgb}
                  distance={distance * 100}
                  note={note}
                  hightlighted={hightlightPoint}
                  distanced={hightlightDistance}
                  onChange={e => { dispatch({ type: `SET_COLOR`, index: i, color: e.target.value }); }}
                  onHightlightedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: i, status: e.target.checked }); }}
                  onDistancedChange={e => { dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, index: i, status: e.target.checked }); }}
                />
              </li>
            );
          })}
        </Subsection>
      </Section>
    </ul>
  );
};
