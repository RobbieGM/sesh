import React from "react";
import Head from "next/head";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav></nav>
    </header>
    {children}
  </div>
);

export default Layout;
