import React from "react";
import tw, { css } from "twin.macro";
import { DocumentText, CurrencyDollar, Code } from "heroicons-react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";

const links = [
  {
    to: "/docs",
    icon: DocumentText,
    iconLabel: "Document",
    text: "Docs",
  },
  {
    to: "/pricing",
    icon: CurrencyDollar,
    iconLabel: "Dollar sign",
    text: "Pricing",
  },
  {
    to: "https://github.com/RobbieGM/sesh",
    icon: Code,
    iconLabel: "Code",
    text: "GitHub",
  },
];

const linkStyle = tw`inline-flex items-center p-1 hover:bg-gray-050 focus:bg-gray-100 focus:outline-none rounded text-gray-800!`;

const stripTrailingSlash = (path: string) =>
  path.endsWith("/") ? path.slice(0, -1) : path;

const TopNavigation: React.FC = () => {
  const location = useLocation();
  return (
    <header css={tw`border-t-4 border-purple-400 flex p-4 items-center`}>
      <Link to="/" css={tw`flex items-center`}>
        <img src="/logo.svg" css={tw`w-8 h-8`} alt="Sesh Logo" />
        <span css={tw`font-bold ml-1 select-none`}>Sesh</span>
      </Link>

      <nav
        css={tw`ml-4 space-x-2 uppercase text-sm font-medium inline-flex items-center`}
      >
        {links
          .map((link) => ({
            ...link,
            content: (
              <span
                css={css`
                  ${tw`inline-flex items-center`}
                  ${stripTrailingSlash(location.pathname) ===
                  stripTrailingSlash(link.to)
                    ? tw`text-teal-700`
                    : tw`text-gray-700`}
                `}
              >
                <link.icon
                  css={css`
                    ${tw`hidden sm:inline`}
                  `}
                  width="20"
                  height="20"
                  aria-label={link.iconLabel}
                />
                {link.text}
              </span>
            ),
          }))
          .map((link) =>
            link.to.startsWith("/") ? (
              <Link to={link.to} css={linkStyle} key={link.to}>
                {link.content}
              </Link>
            ) : (
              <a href={link.to} css={linkStyle} key={link.to}>
                {link.content}
              </a>
            )
          )}
      </nav>
    </header>
  );
};

export default TopNavigation;
