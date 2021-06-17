import { useState, useCallback } from "react";

import { SEO } from "../components/seo";

import colors from "tailwindcss/colors";

import { SecureContext } from "../components/secure-context";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Error } from "../components/error";
import { Canvas } from "../components/canvas";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const [ error, setError ] = useState<string>();

  // Close error handler
  const closeError = useCallback(() => {
    setError(undefined);
  }, []);


  // Return the home component
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
          <Sidebar />

          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar />

            <Error onClose={closeError}>
              {error}
            </Error>

            <div className="flex-grow overflow-hidden">
              <Canvas
                background={colors.white}
              />
            </div>
          </section>
        </SecureContext>
      </div>
    </>
  );
};

export default Home;
