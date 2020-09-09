import Layout from "../components/Layout";
import React from "react";
import tw from "twin.macro";

const FourOhFour: React.FC = () => (
  <Layout title="Page not found">
    <h1 css={tw`font-bold text-3xl`}>404</h1>
    <p>The page you&rsquo;re looking for has moved or doesn&rsquo;t exist.</p>
  </Layout>
);

export default FourOhFour;
