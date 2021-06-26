import { useReducer, useState } from "react";

import { RGBFormat } from "../lib/color";

import { canvasReducer, initialCanvas } from "../reducers/canvas";

import { SEO } from "../components/seo";
import { SecureContext } from "../components/secure-context";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Canvas } from "../components/canvas";
import { TextEditor, Help } from "../components/modal";


/**
 * Index component
 *
 * @returns Index component
 */
const Index = (): JSX.Element => {
  const [ state, dispatch ] = useReducer(canvasReducer, initialCanvas);
  const [ format, setFormat ] = useState<RGBFormat>(`hex`);
  const [ showTextEditor, setShowTextEditor ] = useState(false);
  const [ showHelp, setShowHelp ] = useState(false);


  const openTextEditor = () => { setShowTextEditor(true); };
  const closeTextEditor = () => { setShowTextEditor(false); };
  const openHelp = () => { setShowHelp(true); };
  const closeHelp = () => { setShowHelp(false); };


  // Return index component
  return (
    <>
      <SEO title="RGB Gaps" />

      <div className="flex flex-col select-none min-h-screen md:max-h-screen">
        <Header>
          RGB Gaps
        </Header>

        <SecureContext>
          <Sidebar state={state} format={format} dispatch={dispatch} setFormat={setFormat} openTextEditor={openTextEditor} />

          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar state={state} dispatch={dispatch} openTextEditor={openTextEditor} openHelp={openHelp} />

            <div className="flex-grow overflow-hidden">
              <Canvas state={state} dispatch={dispatch} />
            </div>
          </section>
        </SecureContext>
      </div>

      <TextEditor
        open={showTextEditor}
        state={state}
        format={format}
        dispatch={dispatch}
        setFormat={setFormat}
        onClose={closeTextEditor}
      />

      <Help open={showHelp} onClose={closeHelp} />
    </>
  );
};

export default Index;
