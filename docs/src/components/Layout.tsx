import { Helmet } from "react-helmet";
import React from "react";
// import needed to tell typescript about new `css` property on all elements
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { css } from "@emotion/core";
import "../styles/global.css";
import TopNavigation from "./TopNavigation";
import tw from "twin.macro";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#ffc40d" />
    </Helmet>
    <div>
      <TopNavigation />
      <main css={tw`px-8 sm:px-12 py-6 max-w-screen-lg mx-auto`}>
        {children}
      </main>
    </div>
  </>
);

export default Layout;
