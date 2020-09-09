import Layout from "../components/Layout";
import React from "react";
import tw, { css } from "twin.macro";
import LinkableHeading from "../components/LinkableHeading";

const Docs: React.FC = () => {
  return (
    <Layout title="Sesh Documentation">
      <div
        css={css`
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            ${tw`font-bold`}
          }
          h2 {
            ${tw`text-xl sm:text-2xl`}
          }
          h3 {
            ${tw`text-lg sm:text-xl`}
          }
          h4 {
            ${tw`text-base sm:text-lg`}
          }
        `}
      >
        <h1 css={tw`uppercase text-purple-800`}>Documentation</h1>
        <LinkableHeading level="h2" id="getting-started">
          Getting started
        </LinkableHeading>
      </div>
    </Layout>
  );
};

export default Docs;
