import Layout from "../components/Layout";
import React from "react";
import tw, { css } from "twin.macro";
import { PlusOutline } from "heroicons-react";

const pricingMetricStyle = css`
  small {
    ${tw`text-sm text-gray-700 block`}
  }
`;

const Announce: React.FC<{ as: string }> = ({ as, children }) => (
  <span aria-label={as}>
    <span aria-hidden="true">{children}</span>
  </span>
);

const K = () => <Announce as="thousand">K</Announce>;
const PerMonth = () => <Announce as="per month">/mo</Announce>;

const Pricing: React.FC = () => (
  <Layout title="Pricing">
    <h1 css={tw`text-2xl sm:text-3xl font-bold`}>Sesh Pricing</h1>
    <section css={tw`my-4`}>
      <div css={pricingMetricStyle}>
        <strong>$0.58</strong> USD per 1<K /> sessions created
        <small>
          after 5<K />
          <PerMonth /> free
        </small>
      </div>
      <PlusOutline css={tw`text-gray-600 ml-2`} aria-label="Plus" />
      <div css={pricingMetricStyle}>
        <strong>$0.97</strong> USD per 10
        <K /> API calls
        <small>
          after 30
          <K />
          <PerMonth /> free
        </small>
      </div>
    </section>
    <p>
      No credit card is required, but if you don&rsquo;t provide one and exceed
      the free limits, API calls will return <code>421 Too Many Requests</code>.
    </p>
  </Layout>
);

export default Pricing;
