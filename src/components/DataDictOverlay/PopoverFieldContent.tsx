import { React } from "react";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Popover from "react-bootstrap/Popover";
import Markdown from "react-markdown";

import { useFieldDefinition } from "../../hooks/useFieldDefinition";

export const PopoverFieldContent = ({ field_name, enabled }) => {
  const { data } = useFieldDefinition(field_name, enabled);

  const header = data?.label ? `${data.label} (${field_name})` : field_name;

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
        <Row className="my-1">
          <Col>
            <strong>Short Description:</strong>{" "}
            {data.short_description || "Not Currently Available"}
          </Col>
        </Row>

        <Card className="my-2">
          <Card.Header>
            <strong>Description</strong>
          </Card.Header>
          <Card.Body>
            {data.full_description ? (
              <Markdown>{data.full_description}</Markdown>
            ) : (
              "Not Currently Available"
            )}
          </Card.Body>
        </Card>

        <Card className="my-2">
          <Card.Header>
            <strong>Validation</strong>
          </Card.Header>
          <Card.Body>
            {data.validation ? (
              <Markdown>{data.validation}</Markdown>
            ) : (
              "Not Currently Available"
            )}
          </Card.Body>
        </Card>
      </Popover.Body>
    </>
  );
};
