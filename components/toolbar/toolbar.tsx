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
  const { camera } = state;
  const persp = camera.projection === `perspective`;

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
        <Button title="Import palette" onClick={undefined}>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="palette" fixedWidth transform="left-2 shrink-2"/>
            <FontAwesomeIcon icon="level-up-alt" fixedWidth transform="right-6 up-2" />
          </span>
        </Button>

        <Button title="Export palette" onClick={undefined}>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="palette" fixedWidth transform="left-2 shrink-2"/>
            <FontAwesomeIcon icon="level-down-alt" fixedWidth transform="right-6" />
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
        <Button title="Highlight colors" onClick={undefined}>
          <FontAwesomeIcon icon="bullseye" fixedWidth />
        </Button>

        <Button title="Hightlight nearest distance" onClick={undefined}>
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
