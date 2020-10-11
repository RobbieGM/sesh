import React, { ReactNode } from "react";
import tw, { css } from "twin.macro";

interface Field {
  key: string;
  type: Type;
  comment?: ReactNode;
  optional?: true;
}

interface ObjectType {
  typeName: string;
  fields: Field[];
}

export type Type = string | ObjectType;

interface Props {
  type: Type;
}

const DataType: React.FC<Props> = ({ type }) =>
  typeof type === "string" ? (
    <code css={tw`text-blue-700`}>{type}</code>
  ) : (
    <details
      css={css`
        ${tw`inline align-top ml-6`}
        summary {
          ${tw`-ml-6 inline cursor-default`}
        }
        dt > code:first-child {
          ${tw`font-bold`}
        }
        /* Replace default marker with centered, differently colored one */
        summary::-webkit-details-marker {
          display: none;
        }
        summary::before {
          content: "►";
          ${tw`text-xs w-4 inline-block text-gray-700`}
        }
        &[open] > summary::before {
          content: "▼";
        }
      `}
    >
      <summary>
        <code css={tw`text-blue-700`}>{type.typeName}</code>
      </summary>
      {type.fields.map((field) => (
        <div key={field.key} css={tw`my-2`}>
          <dt>
            <code css={tw`mr-1`}>
              {field.key}
              {field.optional && "?"}:
            </code>
            <DataType type={field.type} />
          </dt>
          {field.comment && <dd>{field.comment}</dd>}
        </div>
      ))}
    </details>
  );
export default DataType;
