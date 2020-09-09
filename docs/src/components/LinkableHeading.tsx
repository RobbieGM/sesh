import React from "react";
import tw, { css } from "twin.macro";
import { LinkOutline } from "heroicons-react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
interface Props {
  id: string;
  level: HeadingLevel;
}

const headingStyle = css`
  position: relative;
  a {
    right: 100%;
    ${tw`text-purple-600 absolute opacity-0 outline-none flex items-center inset-y-0 mr-1`}
  }
  & a:focus,
  &:hover a {
    ${tw`opacity-100`}
  }
  @media (hover: none) {
    a {
      ${tw`opacity-100 right-0`}
    }
  }
`;

const createHeadingComponent = (
  headingLevel: HeadingLevel
): React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
> =>
  function Heading({ children, ...props }) {
    return React.createElement(headingLevel, props, children);
  };

const LinkableHeading: React.FC<Props> = ({ id, level, children }) => {
  const HeadingComponent = createHeadingComponent(level);
  return (
    <HeadingComponent id={id} css={headingStyle}>
      <a href={"#" + id}>
        <LinkOutline aria-label="Link" />
      </a>
      {children}
    </HeadingComponent>
  );
};

export default LinkableHeading;