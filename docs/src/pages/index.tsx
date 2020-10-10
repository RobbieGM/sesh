import { Link } from "gatsby";
import {
  Check,
  CodeOutline,
  CurrencyDollarOutline,
  LightningBoltOutline,
  PuzzleOutline,
  X,
} from "heroicons-react";
import React from "react";
import tw, { css } from "twin.macro";
import Layout from "../components/Layout";

const featureStyle = css`
  ${tw`flex space-x-4`}
  svg {
    ${tw`bg-purple-100 text-purple-700 p-2 w-10 h-10 rounded-lg flex-shrink-0`}
  }
  h2 {
    ${tw`font-bold text-xl`}
  }
`;

const validationLatency = 150;

interface FeatureSupport {
  name: string;
  basic: boolean;
  jwt: boolean;
  sesh: boolean;
}

const featureSupport: FeatureSupport[] = [
  {
    name: "Mutable metadata",
    basic: false,
    jwt: false,
    sesh: true,
  },
  {
    name: "Token restriction by IP/client",
    basic: false,
    jwt: false,
    sesh: true,
  },
  {
    name: "Instant validation",
    basic: false,
    jwt: true,
    sesh: false,
  },
  {
    name: "Logout",
    basic: true,
    jwt: false,
    sesh: true,
  },
  {
    name: "Short token length",
    basic: true,
    jwt: false,
    sesh: true,
  },
  {
    name: "Session expiration",
    basic: true,
    jwt: true,
    sesh: true,
  },
  {
    name: "Logout after inactivity",
    basic: false,
    jwt: false,
    sesh: true,
  },
];

const Supported: React.FC = () => (
  <Check
    css={tw`text-green-600 bg-green-200 rounded-full p-1`}
    aria-label="Supported"
  />
);
const NotSupported: React.FC = () => (
  <X
    css={tw`text-red-600 bg-red-200 rounded-full p-1`}
    aria-label="Not supported"
  />
);
const SupportIndicator: React.FC<{ supported: boolean }> = ({ supported }) =>
  supported ? <Supported /> : <NotSupported />;

const Home: React.FC = () => (
  <Layout title="Sesh">
    <h1
      css={tw`font-bold text-3xl sm:text-4xl leading-tight text-center mb-2 md:mb-4`}
    >
      Powerful Session Management for your Application
    </h1>
    <p css={tw`sm:text-lg text-center`}>
      Stop worrying about maintaining your own database full of stateful
      sessions or dealing with the limitations of JSON Web Tokens. Sesh has
      everything you need when it comes to dealing with your users&rsquo;
      sessions.
    </p>
    <section css={tw`grid gap-4 grid-cols-1 md:grid-cols-2 my-6`}>
      <div css={featureStyle}>
        <CurrencyDollarOutline aria-label="Dollar sign" />
        <div>
          <h2>Fairly priced</h2>
          <p>
            We charge a flat rate per session created, but you get a number of
            free sessions per month before you are charged. This means that for
            small projects where rate limits are not a problem, you can use Sesh
            for free. <em>No credit card is required.</em>
          </p>
        </div>
      </div>
      <div css={featureStyle}>
        <LightningBoltOutline aria-label="Lightning bolt" />
        <div>
          <h2>Fast</h2>
          <p>
            Our servers average {validationLatency}ms to validate a session by
            its token.
          </p>
        </div>
      </div>
      <div css={featureStyle}>
        <PuzzleOutline aria-label="Plugin" />
        <div>
          <h2>Fully featured</h2>
          <p>
            Sesh comes with out-of-the-box support for features that must
            usually be implemented by hand, such as restricting sessions by IP
            or browser fingerprint, logout after inactivity and adding session
            metadata, so you can focus on your application.
          </p>
        </div>
      </div>
      <div css={featureStyle}>
        <CodeOutline aria-label="Code" />
        <div>
          <h2>Open source</h2>
          <p>
            Since Sesh is open source, you can submit bug reports, request
            features, and contribute through{" "}
            <a href="https://github.com/RobbieGM/sesh">GitHub</a>. You can even
            run a copy of Sesh&rsquo;s APIs on-premises to reduce latency.
          </p>
        </div>
      </div>
    </section>
    <h1 css={tw`text-2xl font-bold my-2`}>How Sesh stacks up</h1>
    <section>
      <p>
        Let&rsquo;s compare Sesh to two other common session management
        solutions.
      </p>
      <ul css={tw`pl-6 list-disc`}>
        <li>
          <strong>Basic</strong>&mdash;a simple, stateful custom session
          management solution where sessions are stored in a database with a
          token, user id, and expiration date. These sessions are verified by
          checking the database.
        </li>
        <li>
          <strong>
            <abbr title="JSON Web Token">JWT</abbr>
          </strong>
          &mdash;an increasingly popular authentication scheme where tokens are
          issued by the server and stored with their metadata by the client.
          These sessions are verified cryptographically.
        </li>
      </ul>
      <table
        css={css`
          border-spacing: 0.5rem;
          border-collapse: unset;
          ${tw`table-fixed max-w-2xl -mx-2 my-2`}
          th, td {
          }
        `}
        cellPadding={0}
      >
        <thead>
          <tr
            css={css`
              ${tw`sticky top-0 bottom-0 bg-white`}
              th:not(:first-child) {
                width: min-content;
                ${tw`sm:min-w-16`}
              }
            `}
          >
            <th style={{ width: "100%" }}>Feature</th>
            <th>Basic</th>
            <th>JWT</th>
            <th>Sesh</th>
          </tr>
        </thead>
        <tbody>
          {featureSupport.map((feature) => (
            <tr key={feature.name}>
              <td>{feature.name}</td>
              <td>
                <SupportIndicator supported={feature.basic} />
              </td>
              <td>
                <SupportIndicator supported={feature.jwt} />
              </td>
              <td>
                <SupportIndicator supported={feature.sesh} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    <h1 css={tw`text-2xl font-bold my-4`}>Ready to try it?</h1>
    <Link
      to="/docs#getting-started"
      css={tw`bg-teal-200 text-teal-900 rounded px-4 py-2 hocus:bg-teal-300 hocus:text-gray-900
        focus:outline-none focus:shadow-outline transition duration-100 font-medium text-sm`}
    >
      Read the docs
    </Link>
  </Layout>
);

export default Home;
