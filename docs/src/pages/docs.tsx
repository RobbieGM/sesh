import React from "react";
import tw, { css } from "twin.macro";
import { Type } from "../components/DataType";
import EndpointDocumentation from "../components/EndpointDocumentation";
import Head from "../components/Head";
import HeadingOutlineContainer from "../components/HeadingOutlineContainer";
import LinkableHeading from "../components/LinkableHeading";
import TopNavigation from "../components/TopNavigation";

const baseStyles = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    ${tw`font-bold mt-4 mb-2`}
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

const sessionType: Type = {
  typeName: "Session",
  fields: [
    {
      key: "userId",
      type: "string | number",
      comment: "The ID of the user in your database that this session is for",
    },
    {
      key: "metadata",
      type: "JSON",
      optional: true,
      comment: "Any additional JSON data you want to attach to this session",
    },
    {
      key: "expiresAt",
      type: "DateFromISOString",
      optional: true,
      comment: "Expiration date for this session, as an ISO string",
    },
    {
      key: "ip",
      type: "string",
      optional: true,
      comment: (
        <>
          If set, this requires users of the session to have a matching IP
          address for security. This same IP will be required on all future
          token reads.
        </>
      ),
    },
    {
      key: "clientId",
      type: "string",
      optional: true,
      comment: (
        <>
          If set, this requires users of the session to have a matching client
          ID (which can be any value, such as a browser fingerprint) for
          security. This same client ID will be required on all future token
          reads.
        </>
      ),
    },
  ],
};

const Docs: React.FC = () => {
  return (
    <>
      <Head title="Sesh Documentation" />
      <TopNavigation />
      <main css={tw`max-w-screen-xl mx-auto p-2`}>
        <HeadingOutlineContainer>
          <div
            css={css`
              ${baseStyles} ${tw`ml-4`}
            `}
          >
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
                <a href="https://dashboard.sesh.vercel.app">
                  Create an account
                </a>{" "}
                to start using Sesh APIs.
              </li>
              <li>Create an app under your account once you are signed in.</li>
              <li>
                Go to the app&rsquo;s API keys and create an API key to get
                access to your app. The key will only be shown once, so make
                sure to copy it and store it somewhere safe.
              </li>
            </ol>
            <LinkableHeading level="h2" id="app-setup">
              Setting up Sesh With Your App
            </LinkableHeading>
            <p>
              Every Sesh API endpoint requires that your application send its
              API key through the authorization header. Make sure that with
              every request, you send a header containing{" "}
              <code>Authorization: Bearer YOUR_API_KEY</code>. Request data can
              be submitted in query parameters or in the request body (for
              non-GET requests), and all request bodies should be in JSON
              format. All responses will return valid JSON unless they return{" "}
              <code>null</code>, in which case the response body will be empty.
            </p>
            <p>
              Try to keep HTTP connections to Sesh servers open so that a new
              TCP handshake is not required for each API call. TCP handshakes
              add extra latency, which is the last thing you want at the session
              access layer!
            </p>
            <LinkableHeading level="h2" id="usage">
              Usage
            </LinkableHeading>
            <LinkableHeading level="h3" id="creating-sessions">
              Creating a Session
            </LinkableHeading>
            <EndpointDocumentation
              description={
                <>
                  Creates a session with a securely-generated 16-byte
                  alphanumeric token.
                </>
              }
              endpoint="POST /sessions"
              parameters={sessionType}
              returns="string"
              returnDescription={<>The new session&rsquo;s token</>}
            />
            <LinkableHeading level="h3" id="reading-sessions">
              Reading/Validating a Session
            </LinkableHeading>
            <EndpointDocumentation
              description={<>Retrieves a session by its token.</>}
              endpoint="GET /sessions/[token]"
              parameters={{
                typeName: "GetSessionParameters",
                fields: [
                  { key: "token", type: "string" },
                  {
                    key: "ip",
                    type: "string",
                    comment: (
                      <>
                        The IP address of the user using this session to perform
                        an action. Required to match session&rsquo;s IP if the
                        session has an IP defined.
                      </>
                    ),
                    optional: true,
                  },
                  {
                    key: "clientId",
                    type: "string",
                    comment: (
                      <>
                        The client ID (any value, such as a browser fingerprint)
                        of the user using this session to perform an action.
                        Required to match session&rsquo;s client ID if the
                        session it defined.
                      </>
                    ),
                    optional: true,
                  },
                ],
              }}
              returns={sessionType}
              returnDescription={
                <>
                  A session if one is found, or a 404 error if one is not or the
                  IP or client ID do not match.
                </>
              }
            />
            <LinkableHeading level="h3" id="refreshing-sessions">
              Refreshing a Session&rsquo;s Expiration
            </LinkableHeading>
            <EndpointDocumentation
              description={
                <>
                  Sets the session&rsquo;s expiration to be in a date as far in
                  the future from now as its original expiration date was from
                  the time it was created. Essentially, this resets the
                  session&rsquo;s time-to-live.
                </>
              }
              endpoint="PATCH /sessions/[token]/activity"
              parameters={{
                typeName: "MarkSessionActiveParameters",
                fields: [{ key: "token", type: "string" }],
              }}
              returns="null"
            />
            <LinkableHeading level="h3" id="deleting-sessions">
              Deleting a Session
            </LinkableHeading>
            <EndpointDocumentation
              description={<>Deletes a session by its token.</>}
              endpoint="DELETE /sessions/[token]"
              parameters={{
                typeName: "DeleteSessionParameters",
                fields: [{ key: "token", type: "string" }],
              }}
              returns="null"
            />
            <LinkableHeading level="h3" id="updating-metadata">
              Updating a Session&rsquo;s Metadata
            </LinkableHeading>
            <EndpointDocumentation
              description={
                <>
                  Updates a session&rsquo;s metadata to any new JSON data
                  desired.
                </>
              }
              endpoint="PATCH /sessions/[token]/metadata"
              parameters={{
                typeName: "UpdateSessionMetadataParameters",
                fields: [
                  { key: "token", type: "string" },
                  { key: "metadata", type: "JSON" },
                ],
              }}
              returns="null"
            />
          </div>
        </HeadingOutlineContainer>
      </main>
    </>
  );
};

export default Docs;
