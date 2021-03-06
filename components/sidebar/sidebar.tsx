import { Dispatch, SetStateAction, ButtonHTMLAttributes } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";
import { toHex, randRGB, RGBFormat, BLACK } from "../../lib/color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section } from "./section";
import { Subsection } from "./subsection";
import { Button } from "./button";
import { Radio } from "./radio";
import { Checkbox } from "./checkbox";
import { Toggler } from "./toggler";
import { Range } from "./range";
import { Vector } from "./vector";
import { Color } from "./color";


/**
 * Sidebar component properties
 */
 interface Props {
  readonly state: CanvasState;
  readonly format?: RGBFormat;
  readonly dispatch: Dispatch<CanvasAction>;
  readonly setFormat?: Dispatch<SetStateAction<RGBFormat>>;
  readonly openTextEditor?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Sidebar component
 *
 * @param props Sidebar properties
 */
export const Sidebar = ({ state, format, dispatch, setFormat, openTextEditor }: Props): JSX.Element => {
  const { camera, points } = state;
  const persp = camera.projection === `perspective`;
  const nearest = points?.nearest;
  const farthest = points?.farthest;

  const pointCount = points?.colors.length + 1;
  const distanceCount = pointCount - 1;
  let drawingPoints = points?.drawTarget ? 1 : 0;
  let hightlightedPoints = points?.hightlightTargetPoint ? 1 : 0;
  let drawingDistances = 0;
  let hightlightedDistances = 0;

  // Point and distance mode handlers
  let handleNearestPointModeClick = () => { return; };
  let handleNearestDistanceModeClick = () => { return; };
  let handleFarthestPointModeClick = () => { return; };
  let handleFarthestDistanceModeClick = () => { return; };


  const handleTargetPointModeClick = () => {
    if (points?.hightlightTargetPoint) {
      dispatch({ type: `SET_DRAW`, model: `POINT`, index: `target`, status: false });
      dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: `target`, status: false });
    }
    else if (!points?.drawTarget) {
      dispatch({ type: `SET_DRAW`, model: `POINT`, index: `target`, status: true });
    }
    else {
      dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: `target`, status: true });
    }
  };

  // Color palette
  const palette = points?.colors.map(({ rgb, distance, drawPoint, hightlightPoint, drawDistance, hightlightDistance }, i) => {
    const id = `${toHex(rgb)}-${i}`;
    const note =
      i === points.nearestIndex ? `Nearest` :
      i === points.farthestIndex ? `Farthest` :
      undefined;

    if (drawPoint) drawingPoints++;
    if (hightlightPoint) hightlightedPoints++;
    if (drawDistance) drawingDistances++;
    if (hightlightDistance) hightlightedDistances++;

    const handlePointModeClick = () => {
      if (hightlightPoint) {
        dispatch({ type: `SET_DRAW`, model: `POINT`, index: i, status: false });
        dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: i, status: false });
      }
      else if (!drawPoint) {
        dispatch({ type: `SET_DRAW`, model: `POINT`, index: i, status: true });
      }
      else {
        dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, index: i, status: true });
      }
    };

    const handleDistanceModeClick = () => {
      if (hightlightDistance) {
        dispatch({ type: `SET_DRAW`, model: `DIST`, index: i, status: false });
        dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, index: i, status: false });
      }
      else if (!drawDistance) {
        dispatch({ type: `SET_DRAW`, model: `DIST`, index: i, status: true });
      }
      else {
        dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, index: i, status: true });
      }
    };

    if (i === points.nearestIndex) {
      handleNearestPointModeClick = handlePointModeClick;
      handleNearestDistanceModeClick = handleDistanceModeClick;
    }

    if (i === points.farthestIndex) {
      handleFarthestPointModeClick = handlePointModeClick;
      handleFarthestDistanceModeClick = handleDistanceModeClick;
    }

    return (
      <li key={`${pointCount}-${i}`} className="mb-1">
        <Color
          id={id}
          name={id}
          format={format}
          value={rgb}
          distance={distance}
          note={note}
          drawPoint={drawPoint}
          drawDistance={drawDistance}
          hightlightPoint={hightlightPoint}
          hightlightDistance={hightlightDistance}
          onChange={e => { dispatch({ type: `SET_COLOR`, index: i, color: e.target.value }); }}
          onPointModeClick={handlePointModeClick}
          onDistanceModeClick={handleDistanceModeClick}
          onRemoveClick={pointCount > 3 ? () => { dispatch({ type: `REMOVE_COLOR`, index: i }); } : undefined}
        />
      </li>
    );
  });


  const pointModeIcon =
    !drawingPoints && !hightlightedPoints ? undefined :
    (drawingPoints === pointCount) && (hightlightedPoints === pointCount) ? `check-double` :
    (drawingPoints === pointCount) || (hightlightedPoints === pointCount) ? `check` :
    `question`;

  const distanceModeIcon =
    !drawingDistances && !hightlightedDistances ? undefined :
    (drawingDistances === distanceCount) && (hightlightedDistances === distanceCount) ? `check-double` :
    (drawingDistances === distanceCount) || (hightlightedDistances === distanceCount) ? `check` :
    `question`;


  // Points mode handler
  const handlePointsModeClick = () => {
    if ((drawingPoints === pointCount) && (hightlightedPoints === pointCount)) {
      dispatch({ type: `SET_DRAW`, model: `POINT`, status: false });
      dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, status: false });
    }
    else if ((!drawingPoints && !hightlightedPoints) || (hightlightedPoints === pointCount)) {
      dispatch({ type: `SET_DRAW`, model: `POINT`, status: true });
    }
    else if (drawingPoints === pointCount) {
      dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, status: true });
    }
    else {
      dispatch({ type: `SET_DRAW`, model: `POINT`, status: true });
      dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, status: true });
    }
  };

  // Distances mode hangler
  const handleDistancesModeClick = () => {
    if ((drawingDistances === distanceCount) && (hightlightedDistances === distanceCount)) {
      dispatch({ type: `SET_DRAW`, model: `DIST`, status: false });
      dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, status: false });
    }
    else if ((!drawingDistances && !hightlightedDistances) || (hightlightedDistances === distanceCount)) {
      dispatch({ type: `SET_DRAW`, model: `DIST`, status: true });
    }
    else if (drawingDistances === distanceCount) {
      dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, status: true });
    }
    else {
      dispatch({ type: `SET_DRAW`, model: `DIST`, status: true });
      dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, status: true });
    }
  };


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
            <Radio id="hex" name="format" label="Hexadecimal" checked={format === `hex`} onChange={setFormat && (() => { setFormat(`hex`); })} />
            <Radio id="rgb" name="format" label="0..255" checked={format === `rgb`} onChange={setFormat && (() => { setFormat(`rgb`); })} />
            <Radio id="pct" name="format" label="Percentage" checked={format === `pct`} onChange={setFormat && (() => { setFormat(`pct`); })} />
            <Radio id="arith" name="format" label="0..1" checked={format === `arith`} onChange={setFormat && (() => { setFormat(`arith`); })} />
          </div>
        </li>
        <li>
          <div className="flex justify-end space-x-0.5">
            <div title="Points mode" className="flex flex-col items-center space-y-0.5">
              <label htmlFor="points-mode" >
                <FontAwesomeIcon icon="bullseye" fixedWidth />
              </label>
              <Toggler id="points-mode" name="points-mode" icon={pointModeIcon} onClick={handlePointsModeClick} />
            </div>
            <div title="Distances mode" className="flex flex-col items-end space-y-0.5">
              <label htmlFor="distances-mode" >
                <FontAwesomeIcon icon="route" fixedWidth />
              </label>
              <Toggler id="distances-mode" name="distances-mode" icon={distanceModeIcon} onClick={handleDistancesModeClick} />
            </div>
          </div>
        </li>
        <li>
          <Color
            id="target"
            name="target"
            format={format}
            label="Target:"
            value={points?.target || BLACK}
            drawPoint={points?.drawTarget}
            hightlightPoint={points?.hightlightTargetPoint}
            onChange={e => { dispatch({ type: `SET_COLOR`, index: `target`, color: e.target.value }); }}
            onPointModeClick={handleTargetPointModeClick}
          />
        </li>
        <li>
          <Color
            id="nearest"
            name="nearest"
            format={format}
            label="Nearest:"
            value={nearest?.rgb || BLACK}
            distance={nearest?.distance}
            drawPoint={nearest?.drawPoint}
            drawDistance={nearest?.drawDistance}
            hightlightPoint={nearest?.hightlightPoint}
            hightlightDistance={nearest?.hightlightDistance}
            disabled
            onPointModeClick={handleNearestPointModeClick}
            onDistanceModeClick={handleNearestDistanceModeClick}
          />
        </li>
        <li>
          <Color
            id="farthest"
            name="farthest"
            format={format}
            label="Farthtest:"
            value={farthest?.rgb || BLACK}
            distance={farthest?.distance}
            drawPoint={farthest?.drawPoint}
            drawDistance={farthest?.drawDistance}
            hightlightPoint={farthest?.hightlightPoint}
            hightlightDistance={farthest?.hightlightDistance}
            disabled
            onPointModeClick={handleFarthestPointModeClick}
            onDistanceModeClick={handleFarthestDistanceModeClick}
          />
        </li>
        <hr className="mt-1" />
        <Subsection title="Palette" defaultOpen>
          <li className="flex space-x-2 mb-1">
            <Button onClick={openTextEditor}>
              Text editor
            </Button>
            <Button onClick={() => { dispatch({ type: `ADD_COLOR`, color: toHex(randRGB()) }); }}>
              Add color
            </Button>
          </li>
          {palette}
        </Subsection>
      </Section>
    </ul>
  );
};
