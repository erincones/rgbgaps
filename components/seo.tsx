import Head from "next/head";


/**
 * SEO properties
 */
interface Props {
  readonly title: string,
  readonly twitterCard?: boolean,
  readonly openGraph?: boolean
}


/**
 * SEO component
 *
 * @param props SEO component properties
 * @returns SEO component
 */
export const SEO = ({ title, twitterCard = true, openGraph = true }: Props): JSX.Element => {
  return (
    <Head>
      {/* Twitter card */}
      {twitterCard && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="RGB Gaps" />
          <meta name="twitter:description" content="Online RGB distance meter" />
          <meta name="twitter:creator" content="@ErickRincones" />
          <meta name="twitter:image" content="https://rgbgaps.vercel.app/cover.png" />
        </>
      )}

      {/* Open graph */}
      {openGraph && (
        <>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="RGB Gaps" />
          <meta property="og:description" content="Online RGB distance meter" />
          <meta property="og:url" content="https://rgbgaps.vercel.app" />
          <meta property="og:image" content="https://rgbgaps.vercel.app/cover.png" />
        </>
      )}

      {/* Title and manifest */}
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />

      {/* Global custom CSS */}
      <style id="__global_css" />
    </Head>
  );
};
