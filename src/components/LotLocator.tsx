// return an empty page that will have form with just lot related elements:
import React, { useState } from "react";

import { Link } from "react-router";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useLots } from "../hooks/UseLots";
import { Lot, SelectChoice } from "../types/types";
import { get_value_labels } from "../utils";
import { LotTable } from "../components/LotTable";

const species = (lots: Lot[]): SelectChoice[] =>
  get_value_labels(lots, "species_code", "species_name", false, "---");

const lot_nums = (lots: Lot[]): SelectChoice[] =>
  get_value_labels(lots, "lot_num", "lot_num", false, "---");

const strains = (lots: Lot[]): SelectChoice[] =>
  get_value_labels(lots, "strain_slug", "strain_name", false, "---");

const spawnYears = (lots: Lot[]): SelectChoice[] =>
  get_value_labels(lots, "spawn_year", "spawn_year", true, "---");

const hatcheries = (lots: Lot[]): SelectChoice[] =>
  get_value_labels(
    lots,
    "rearing_location_abbrev",
    "rearing_location_name",
    false,
    "---",
  );

export const LotLocator = ({ selectedLot, setSelectedLot }) => {
  const [lotFilters, setLotFilters] = useState({});

  const serverLots = useLots();
  const lotData = serverLots ? serverLots : [];
  // convert spawn year to a string so our filters all work:
  if (lotData) {
    lotData.forEach((d) => (d.spawn_year = d.spawn_year + ""));
  }

  const filteredLots =
    Object.keys(lotFilters).length === 0
      ? lotData
      : lotData.filter((item) =>
          Object.entries(lotFilters).every(
            ([key, value]) => item[key] === value,
          ),
        );

  const handleChange = (event) => {
    const { name, value } = event.target;
    let current = { ...lotFilters };
    if (value === "") {
      delete current[name];
    } else {
      current[name] = value;
    }
    setLotFilters({ ...current });
  };

  const handleResetClick = (event) => {
    setLotFilters({});
    setSelectedLot("");
  };

  const rowClicked = (event) => {
    setSelectedLot(event.target.id);
  };

  const selectLotClicked = (event) => {
    alert(`You selected lot: ${selectedLot}`);
    setSelectedLot("");
    // todo - add to context and return to main form...
  };

  const handleChange2 = (event) => {
    console.log(event.target.value);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Card className="my-4 px-0">
          <Card.Header as="h1">
            <div className="h2">Lot Locator</div>
          </Card.Header>
          <Card.Body>
            <Row>
              <p>
                This form is intended to help you select the correct Lot for
                your stocking event. Selected the appropropriate values from any
                of the drop down lists and the matching lots will be dynamically
                updated. Once you find your lot check radio button in the
                corresponding row and then click on 'Select Lot' to return to
                the main stocking event form.{" "}
              </p>

              <p>
                If you are still unable to find a Lot matching the attributes of
                your stocking event you can create one here:
                <Link to="/create_lot">Lot Creator</Link>
              </p>
            </Row>

            <Row className="my-2">
              <Col>
                <Form.Group className="mb-3" controlId="select-species">
                  <Form.Label>Species</Form.Label>
                  <Form.Select
                    aria-label="select-species"
                    name="species_code"
                    onChange={handleChange}
                    value={lotFilters?.species_code || ""}
                  >
                    {species(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-strain">
                  <Form.Label>Strain</Form.Label>
                  <Form.Select
                    aria-label="select-strain"
                    name="strain_slug"
                    onChange={handleChange}
                    value={lotFilters?.strain_slug || ""}
                  >
                    {strains(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-spawn-year">
                  <Form.Label>Spawn Year</Form.Label>

                  <Form.Select
                    aria-label="select-spawn-year"
                    name="spawn_year"
                    onChange={handleChange}
                    value={lotFilters?.spawn_year || ""}
                  >
                    {spawnYears(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="my-2">
              <Col>
                <Form.Group className="mb-3" controlId="select-lot-number">
                  <Form.Label>Fish Culture Lot Number</Form.Label>

                  <Form.Select
                    aria-label="select-lot-number"
                    name="lot_num"
                    onChange={handleChange}
                    value={lotFilters?.lot_num || ""}
                  >
                    {lot_nums(filteredLots).map((x, i) => (
                      <option key={i} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="select-rearing-location"
                >
                  <Form.Label>Rearing Location</Form.Label>

                  <Form.Select
                    aria-label="select-hatchery"
                    name="rearing_location_abbrev"
                    onChange={handleChange}
                    onKeyUp={handleChange2}
                    value={lotFilters?.rearing_location_abbrev || ""}
                  >
                    {hatcheries(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-end">
              <Col md={2}>
                <Button
                  variant="secondary"
                  disabled={Object.keys(lotFilters).length === 0 ? true : false}
                  onClick={handleResetClick}
                >
                  Reset Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      <Row className="my-4">
        <h2 className="my-4 h4">
          Matching Lots (n={filteredLots ? filteredLots.length : 0}):
        </h2>
        <LotTable
          lots={filteredLots}
          selectedLot={selectedLot}
          rowClicked={rowClicked}
        />
      </Row>
    </Container>
  );
};
