import React, { ReactNode } from "react";
import tw from "twin.macro";
import DataType, { Type } from "./DataType";
import LinkableHeading from "./LinkableHeading";

interface Props {
  heading: ReactNode;
  headingId: string;
  /** Describes what the endpoint does */
  description: ReactNode;
  /** Method and path, e.g. GET /some/resource */
  endpoint: string;
  parameters: Type;
  returns: Type;
  /** Description of what is returned from the endpoint */
  returnDescription?: ReactNode;
}

const h4Style = tw`text-sm! uppercase text-gray-800 border-b border-gray-300 max-w-sm mt-2!`;

const EndpointDocumentation: React.FC<Props> = ({
  heading,
  headingId,
  description,
  endpoint,
  parameters,
  returns,
  returnDescription,
}) => (
  <div css={tw`my-6`}>
    <LinkableHeading level="h3" id={headingId}>
      {heading}
    </LinkableHeading>
    <p>{description}</p>
    <p>
      <code>{endpoint}</code>
    </p>
    <h4 css={h4Style}>Parameters</h4>
    <DataType type={parameters} />
    <h4 css={h4Style}>Returns</h4>
    {returnDescription && <p>{returnDescription}</p>}
    <DataType type={returns} />
  </div>
);

export default EndpointDocumentation;
