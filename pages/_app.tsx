import { ReactNode } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import colors from "tailwindcss/colors";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";

import { glMatrix } from "gl-matrix";


// Setup font awesome
library.add(fas, fab, far);
config.autoAddCss = false;

// Setup glMatrix type
glMatrix.setMatrixArrayType(Array);


/**
 * Application component
 *
 * @param props Application component properties
 * @returns Application component
 */
const App = ({ Component, pageProps }: AppProps): ReactNode => {
  return (
    <>
      <Head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />

        <meta name="application-name" content="RGB Gaps" />
        <meta name="author" content="Erick Rincones" />
        <meta name="description" content="Online RGB distance meter." />
        <meta name="generator" content="Next.js" />
        <meta name="keywords" content="rgb, gaps, distance, meter, web, online" />
        <meta name="theme-color" content={colors.blueGray[`700`]} />

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" type="image/x-icon" sizes="16x16" href="/favicon.ico" />

        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
