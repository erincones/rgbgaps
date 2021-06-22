import { Dispatch } from "react";

import { CanvasState, CanvasAction } from "../../reducers/canvas";

import { Section } from "./section";
import { Subsection } from "./subsection";
import { Button } from "./button";


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
  const { camera } = state;


  // Return sidebar
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 overflow-auto md:w-80 h-1/3 md:h-auto">
      <Section title="Camera">
        <li className="flex">
          FOV: {camera.fov.toFixed(2)}°
        </li>
        <li className="flex">
          Position: {(camera.position as number[]).map(e => e.toFixed(2)).join(`, `)}
        </li>
        <li className="flex">
          Direction: {(camera.front as number[]).map(e => e.toFixed(2)).join(`, `)}
        </li>
        <li className="text-right">
          <Button title="Reset camera" onClick={() => { dispatch({ type: `RESET_CAMERA` }); }}>
            Reset
          </Button>
        </li>
      </Section>

      <Section title="Cube">
        <li className="flex">
          Opacity:
        </li>
        <li className="flex">
          Axis:
        </li>
        <li className="flex">
          Grid:
        </li>
      </Section>

      <Section title="Colors" defaultOpen>
        <li className="flex">
          Mode:
        </li>
        <li className="flex">
          Hightlight:
        </li>
        <li className="flex">
          Nearest:
        </li>
        <li className="flex">
          Size:
        </li>
        <li className="flex">
          Target:
        </li>
        <Subsection title="Palette" defaultOpen>
          <li>
            <ul className="flex space-x-1">
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
          <li className="flex">
            Color 1:
          </li>
        </Subsection>
      </Section>
    </ul>
  );
};
