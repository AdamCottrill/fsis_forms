import { React } from "react";

import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Popover from "react-bootstrap/Popover";

import Markdown from "react-markdown";

import { useTableDefinition } from "../../hooks/useTableDefinition";

export const PopoverTableContent = ({ table_name, enabled }) => {
  const { data } = useTableDefinition(table_name, enabled);

  const header = data?.name ? `${data.name} (${table_name})` : table_name;

  if (Object.keys(data).length === 0) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <Popover.Header as="h3">{header}</Popover.Header>
      <Popover.Body>
        <Card className="my-2">
          <Card.Header>
            <strong>Description</strong>
          </Card.Header>
          <Card.Body>
            {data.description ? (
              <Markdown>{data.description}</Markdown>
            ) : (
              "Not Currently Available"
            )}
          </Card.Body>
        </Card>
      </Popover.Body>
    </>
  );
};
