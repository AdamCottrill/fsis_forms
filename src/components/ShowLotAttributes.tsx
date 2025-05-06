import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { Lot } from "../types/types";

import { parseLotSlug } from "../utils";

interface showLotInterface {
  lots: Lot[];
  selectedLot: string;
}

export const ShowLotAttributes = ({ lots, selectedLot }: showLotInterface) => {
  if (!selectedLot || !lots.length) {
    return;
  }

  const attrs = parseLotSlug(lots, selectedLot);

  return (
    <Card data-testid="selected-lot-attributes" className="px-4 py-2">
      <Row className="my-1">
        <Col>
          <strong>Lot Number:</strong> {attrs.lot_num || "---"}
        </Col>
        <Col>
          <strong>Spawn Year:</strong>
          {attrs.spawn_year}
        </Col>
      </Row>
      <Row className="my-1">
        <Col data-testid="selected-species">
          <strong>Species:</strong> {attrs.species}
        </Col>
        <Col data-testid="selected-strain">
          <strong>Strain:</strong>
          {attrs.strain}
        </Col>
      </Row>
      <Row className="my-1">
        <Col>
          <strong>Rearing Location:</strong>
          {attrs.rearing_location}
        </Col>
      </Row>
    </Card>
  );
};
