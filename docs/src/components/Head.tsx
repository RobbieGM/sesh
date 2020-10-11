import React from "react";
import { Helmet } from "react-helmet";

interface Props {
  title: string;
}

const Head: React.FC<Props> = ({ title }) => (
  <Helmet>
    <title>{title}</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#ffc40d" />
  </Helmet>
);

export default Head;
