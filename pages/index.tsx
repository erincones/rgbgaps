import { useReducer } from "react";

import { canvasReducer, initialCanvas } from "../reducers/canvas";

import { SEO } from "../components/seo";
import { SecureContext } from "../components/secure-context";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Canvas } from "../components/canvas";


/**
 * Index component
 *
 * @returns Index component
 */
const Index = (): JSX.Element => {
  const [ state, dispatch ] = useReducer(canvasReducer, initialCanvas);


  // Return index component
  return (
    <>
      <SEO title="RGB Gaps" />

      <div className="flex flex-col select-none min-h-screen md:max-h-screen">
        {/* Header */}
        <header className="bg-blueGray-600 text-center px-2 py-1">
          <h3 className="text-blueGray-100 text-xl font-bold">
            RGB Gaps
          </h3>
        </header>

        <SecureContext>
          <Sidebar state={state} dispatch={dispatch} />

          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar state={state} dispatch={dispatch} />

            <div className="flex-grow overflow-hidden">
              <Canvas state={state} dispatch={dispatch} />
            </div>
          </section>
        </SecureContext>
      </div>
    </>
  );
};

export default Index;
