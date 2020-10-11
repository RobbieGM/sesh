import React from "react";
// import needed to tell typescript about new `css` property on all elements
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { css } from "@emotion/core";
import "../styles/global.css";
import TopNavigation from "./TopNavigation";
import tw from "twin.macro";
import Head from "./Head";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <TopNavigation />
    <main css={tw`px-8 sm:px-12 py-6 max-w-screen-lg mx-auto`}>{children}</main>
  </>
);

export default Layout;
