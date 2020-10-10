import Layout from "../components/Layout";
import React from "react";
import tw, { css } from "twin.macro";
import LinkableHeading from "../components/LinkableHeading";

const baseStyles = css`
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
  ol,
  ul {
    ${tw`pl-8`}
    list-style-type: revert;
  }
  code {
    ${tw`bg-gray-100 inline-block rounded-sm px-1 text-sm`}
  }
  p,
  ul,
  ol {
    ${tw`my-2`}
  }
`;

const Docs: React.FC = () => {
  return (
    <Layout title="Sesh Documentation">
      <div css={baseStyles}>
        <h1 css={tw`uppercase text-purple-800`}>Documentation</h1>
        <LinkableHeading level="h2" id="getting-started">
          Getting Started
        </LinkableHeading>
        <p>
          Sesh provides an easy-to-use, low-latency RESTful API to manage
          users&rsquo; sessions in your application. To get started,
          you&rsquo;ll need an API key.
        </p>
        <ol>
          <li>
            <a href="https://dashboard.sesh.vercel.app">Create an account</a> to
            start using Sesh APIs.
          </li>
          <li>Create an app under your account once you are signed in.</li>
          <li>
            Go to the app&rsquo;s API keys and create an API key to get access
            to your app. The key will only be shown once, so make sure to copy
            it and store it somewhere safe.
          </li>
        </ol>
        <LinkableHeading level="h2" id="app-setup">
          Setting up Sesh With Your App
        </LinkableHeading>
        <p>
          Every Sesh API endpoint requires that your application send its API
          key through the authorization header. Make sure that with every
          request, you send a header containing{" "}
          <code>Authorization: Bearer YOUR_API_KEY</code>. All request bodies
          should be in JSON format, and all responses will return valid JSON.
        </p>
        <p>
          Try to keep HTTP connections to Sesh servers open so that a new TCP
          handshake is not required for each API call. TCP handshakes add extra
          latency, which is the last thing you want at the session access layer!
        </p>
      </div>
    </Layout>
  );
};

export default Docs;
