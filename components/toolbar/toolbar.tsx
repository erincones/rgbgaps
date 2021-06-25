import { Dispatch } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Separator } from "./separator";
import { Button } from "./button";


/**
 * Toolbar component properties
 */
interface Props {
  readonly state: CanvasState;
  readonly dispatch: Dispatch<CanvasAction>;
}


/**
 * Toolbar component
 *
 * @param props Toolbar component properties
 */
export const Toolbar = ({ state, dispatch }: Props): JSX.Element => {
  const { camera, points } = state;

  const persp = camera.projection === `perspective`;
  const hightlightedPoints = points?.hightlightedAllPoints();
  const hightlightedDistances = points?.hightlightedAllDistances();

  // Return toolbar
  return (
    <div className="flex bg-blueGray-300 border-b border-blueGray-400 px-2 py-1">
      <div className="space-x-1">
        <Button title="Reset camera" onClick={() => { dispatch({ type: `RESET_CAMERA` }); }}>
          <FontAwesomeIcon icon="home" fixedWidth />
        </Button>
      </div>

      <Separator />

      <div className="space-x-1">
        <Button title="Text palette editor" onClick={undefined}>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="palette" fixedWidth transform="left-1 up-3 shrink-1" />
            <FontAwesomeIcon icon="font" fixedWidth transform="right-3 down-5 shrink-4" />
          </span>
        </Button>
      </div>

      <Separator />

      <div className="space-x-1">
        <Button title="Toggle projection" active={persp} onClick={() => { dispatch({ type: `SET_PROJECTION`, projection: persp ? `orthogonal` : `perspective` }); }}>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="cube" fixedWidth transform="right-2 up-5 shrink-2" />
            <FontAwesomeIcon icon="video" fixedWidth transform="left-2 down-6 shrink-2" />
          </span>
        </Button>

        <Button title="Draw cube" active={state.drawCube} onClick={() => { dispatch({ type: `SET_DRAW`, model: `CUBE`, status: !state.drawCube }); }}>
          <FontAwesomeIcon icon="cube" fixedWidth />
        </Button>

        <Button title="Draw axis" active={state.drawAxis} onClick={() => { dispatch({ type: `SET_DRAW`, model: `AXIS`, status: !state.drawAxis }); }}>
          <FontAwesomeIcon icon="ruler-combined" fixedWidth />
        </Button>

        <Button title="Draw grid" active={state.drawGrid} onClick={() => { dispatch({ type: `SET_DRAW`, model: `GRID`, status: !state.drawGrid }); }}>
          <FontAwesomeIcon icon="border-none" fixedWidth />
        </Button>

        <Button title="Draw diagonal" active={state.drawDiagonal} onClick={() => { dispatch({ type: `SET_DRAW`, model: `DIAG`, status: !state.drawDiagonal }); }}>
          <FontAwesomeIcon icon="expand-alt" fixedWidth />
        </Button>
      </div>

      <Separator />

      <div className="space-x-1">
        <Button title="Toggle points mode" onClick={() => { dispatch({ type: `SET_HIGHTLIGHT`, model: `POINT`, status: !hightlightedPoints }); }}>
          <FontAwesomeIcon icon="bullseye" fixedWidth />
        </Button>

        <Button title="Toggle distances mode" onClick={() => { dispatch({ type: `SET_HIGHTLIGHT`, model: `DIST`, status: !hightlightedDistances }); }}>
          <FontAwesomeIcon icon="route" fixedWidth />
        </Button>
      </div>

      <div className="flex-grow text-right">
        <Button title="Help" onClick={undefined}>
          <FontAwesomeIcon icon="question" fixedWidth />
        </Button>
      </div>
    </div>
  );
};
