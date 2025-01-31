import { useContext } from "react";

import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const AccordionToggle = ({ children, eventKey, callback }) => {
  const { activeEventKey } = useContext(AccordionContext);

  const toggleAccordion = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <>
      <Row>
        <Col>{children}</Col>
        <Col md={1}>
          <Button
            onClick={toggleAccordion}
            aria-label="Toggle Accordion"
            variant="outline-primary"
          >
            {isCurrentEventKey ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
        </Col>
      </Row>
    </>
  );
};
