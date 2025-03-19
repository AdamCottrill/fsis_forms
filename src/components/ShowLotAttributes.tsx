import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { parseLotSlug } from "../utils";

export const ShowLotAttributes = ({ lots, selectedLot }) => {
  const attrs = parseLotSlug(lots, selectedLot);

  return (
    <Card className="px-4 py-2">
      <Row className="my-1">
        <Col>
          <strong>Lot Number</strong> {attrs.lot_num}
        </Col>
        <Col>
          <strong>Spawn Year:</strong>
          {attrs.spawn_year}
        </Col>
      </Row>
      <Row className="my-1">
        <Col>
          <strong>Species:</strong> {attrs.species}
        </Col>

        <Col>
          <strong>Strain:</strong>
          {attrs.strain}
        </Col>
      </Row>

      <Row className="my-1">
        <Col>
          <strong>Proponent:</strong>
          {attrs.proponent}
        </Col>
        <Col>
          <strong>Rearing Location:</strong>
          {attrs.rearing_location}
        </Col>
      </Row>
      <Row className="my-1">
        <Col>
          <strong>Funding Type:</strong>
          {attrs.funding_type}
        </Col>
      </Row>
    </Card>
  );
};
