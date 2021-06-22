import { useRef, useState, useEffect, MutableRefObject, Dispatch, MouseEventHandler, WheelEventHandler } from "react";

import { usePrevious } from "../../hooks/previous";
import { CanvasState, CanvasAction } from "../../reducers/canvas";

import { Error } from "./error";


/**
 * Canvas component properties
 */
 interface Props {
  readonly state: CanvasState;
  readonly dispatch: Dispatch<CanvasAction>;
}

/** Plane point */
interface Point {
  readonly x: number;
  readonly y: number;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 * @param ref Reference
 */
export const Canvas = ({ state, dispatch }: Props): JSX.Element => {
  const container = useRef() as MutableRefObject<HTMLDivElement>;
  const canvas = useRef() as MutableRefObject<HTMLCanvasElement>;
  const css = useRef() as MutableRefObject<HTMLStyleElement>;

  const [ mouse, setMouse ] = useState<Point>();
  const prevMouse = usePrevious(mouse);


  // Mouse down handler
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    if (e.buttons === 1) {
      css.current.media = ``;
      setMouse({ x: e.clientX, y: e.clientY });
    }
  };

  // Wheel handler
  const handleWheel: WheelEventHandler<HTMLDivElement> = e => {
    dispatch({ type: e.deltaY < 0 ? `ZOOM_IN` : `ZOOM_OUT` });
  };

  // Close error handler
  const handleCloseError = () => {
    dispatch({ type: `CLOSE_ERRORS` });
  };


  // Setup canvas
  useEffect(() => {
    dispatch({
      type: `INITIALIZE`,
      container: container.current,
      canvas: canvas.current
    });

    // Global css
    css.current = document.head.appendChild(document.createElement(`style`));
    css.current.innerText = `* { cursor: grabbing !important }`;
    css.current.media = `not all`;

    // Viewport size management
    const resizeHandler = () => { dispatch({ type: `RESIZE` }); };

    // Mouse up handler
    const handleMouseUp = () => {
      css.current.media = `not all`;
      setMouse(undefined);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        setMouse(point => point ? { x: e.clientX, y: e.clientY } : undefined);
      }
    };

    window.addEventListener(`resize`, resizeHandler, true);
    window.addEventListener(`mouseup`, handleMouseUp, true);
    window.addEventListener(`mousemove`, handleMouseMove, true);

    // Clean up
    return () => {
      window.removeEventListener(`resize`, resizeHandler, true);
      window.removeEventListener(`mouseup`, handleMouseUp, true);
      window.removeEventListener(`mousemove`, handleMouseMove, true);

      dispatch({ type: `CLEAN_UP` });
    };
  }, [ dispatch ]);

  // Rotate cube
  useEffect(() => {
    if (!mouse || !prevMouse) return;

    const dx = mouse.x - prevMouse.x;
    const dy = prevMouse.y - mouse.y;

    if (dx || dy) {
      dispatch({ type: `ROTATE`, dx, dy, center: [ 0, 0, 0 ] });
    }
  }, [ mouse, prevMouse, dispatch ]);


  // Return canvas
  return (
    <div
      ref={container}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      className="relative overflow-hidden w-full h-full"
    >
      <canvas ref={canvas} className="absolute inset-l-0 inset-t-0 md:cursor-grab">
        Your browser does not support the canvas tag.
      </canvas>
      <Error onClose={handleCloseError}>
        {state.errors}
      </Error>
    </div>
  );
};
