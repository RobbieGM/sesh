import React, { JSXElementConstructor, ReactElement, ReactNode } from "react";
import { Children } from "react";
import tw, { css } from "twin.macro";
import { HeadingLevel, Props as LinkableHeadingProps } from "./LinkableHeading";

interface Heading {
  /** Heading level, 1-6 = h1-h6 */
  level: HeadingLevel;
  text: string;
  id: string;
}

const isReactElement = (node: ReactNode): node is ReactElement =>
  node != null && typeof node == "object" && "type" in node && "props" in node;

const getHeadings = (children: ReactNode): Heading[] => {
  const headings: Heading[] = [];
  Children.forEach(children, (node) => {
    if (isReactElement(node)) {
      const isLinkableHeading =
        typeof node.type === "function" &&
        (node.type as JSXElementConstructor<unknown> & {
          displayName?: string;
        }).displayName === "LinkableHeading";
      if (isLinkableHeading) {
        const props = node.props as LinkableHeadingProps;
        headings.push({
          level: props.level,
          text: node.props.children as string,
          id: props.id,
        });
      }
      headings.push(...getHeadings(node.props.children));
    }
  });
  return headings;
};

const styleFromHeadingLevel = (level: Exclude<HeadingLevel, "h1">) =>
  level === "h2"
    ? tw`text-lg`
    : level === "h3"
    ? tw`text-base ml-2`
    : level === "h4"
    ? tw`text-sm ml-4`
    : tw`text-xs ml-6`;

const HeadingOutlineContainer: React.FC = ({ children }) => {
  const headings = getHeadings(children);
  console.debug("headings", headings);
  return (
    <div css={tw`flex`}>
      <nav
        css={css`
          & {
            height: max-content;
          }
          ${tw`w-64 mr-4 pt-4 sticky top-0 hidden md:block`}
        `}
      >
        <div css={tw`uppercase text-sm font-bold mb-2 pl-2`}>On this page</div>
        {headings.map(({ level, text, id }) => (
          <a
            href={`#${id}`}
            key={id}
            css={css`
              ${tw`block text-gray-900 my-1 hocus:text-green-900 hover:bg-green-100 focus:outline-none
              focus:bg-green-200 active:bg-green-200 px-2 rounded`}
              ${level !== "h1" && styleFromHeadingLevel(level)}
            `}
          >
            {text}
          </a>
        ))}
      </nav>
      <div css={tw`flex-1`}>{children}</div>
    </div>
  );
};

export default HeadingOutlineContainer;
