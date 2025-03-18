// return an empty page that will have form with just lot related elements:
import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { getLots } from "../services/api";
import { Lot, SelectChoice } from "../services/types";
import { get_value_labels } from "../utils";
import { LotTable } from "../components/LotTable";

const species = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(filteredLots, "species_code", "species_name", false, "---");

const lot_nums = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(filteredLots, "lot_num", "slug", false, "---");

const strains = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(filteredLots, "strain_slug", "strain_name", false, "---");

const spawnYears = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(filteredLots, "spawn_year", "spawn_year", true, "---");

const proponents = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(
    filteredLots,
    "proponent_abbrev",
    "proponent_name",
    false,
    "---",
  );

const hatcheries = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(
    filteredLots,
    "rearing_location_abbrev",
    "rearing_location_name",
    false,
    "---",
  );

const funding_types = (filteredLots: Lot[]): SelectChoice[] =>
  get_value_labels(filteredLots, "funding_type", "funding_type", false, "---");

export const LotFinder = () => {
  const [lotFilters, setLotFilters] = useState({});

  // get all of our lots:
  const {
    isPending: lotIsPending,
    error: lotError,
    data: serverLots,
  } = useQuery({ queryKey: ["lots"], queryFn: () => getLots() });

  const lotData = serverLots ? serverLots.results : [];
  // convert spawn year to a string so our filters all work:
  lotData.forEach((d) => (d.spawn_year = d.spawn_year + ""));

  const filteredLots =
    Object.keys(lotFilters).length === 0
      ? lotData
      : lotData.filter((item) =>
          Object.entries(lotFilters).every(
            ([key, value]) => item[key] === value,
          ),
        );

  const handleChange2 = (event) => {
    const { name, value } = event.target;
    let current = { ...lotFilters };
    if (value === "") {
      delete current[name];
    } else {
      current[name] = value;
    }
    setLotFilters({ ...current });
  };

  if (lotIsPending) return "Loading...";

  if (lotError) return "An error has occurred: " + lotError.message;

  return (
    <Container>
      <Row className="justify-content-center">
        <Card className="my-1">
          <Card.Header as="h2">
            <div className="h5">Lot Selector</div>
          </Card.Header>
          <Card.Body>
            <Row className="my-2">
              <Col>
                <Form.Group className="mb-3" controlId="select-lot-number">
                  <Form.Label>Lot number</Form.Label>

                  <Form.Select
                    aria-label="select-lot-number"
                    name="lot_num"
                    onChange={handleChange2}
                  >
                    {lot_nums(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-species">
                  <Form.Label>Species</Form.Label>
                  <Form.Select
                    aria-label="select-species"
                    name="species_code"
                    onChange={handleChange2}
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
                    onChange={handleChange2}
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
                    onChange={handleChange2}
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
                <Form.Group className="mb-3" controlId="select-proponent">
                  <Form.Label>Proponent</Form.Label>

                  <Form.Select
                    aria-label="select-proponent"
                    name="proponent_abbrev"
                    onChange={handleChange2}
                  >
                    {proponents(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
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
                    onChange={handleChange2}
                  >
                    {hatcheries(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="select-funding-type">
                  <Form.Label>Funding Type</Form.Label>

                  <Form.Select
                    aria-label="select-funding_type"
                    name="funding_type"
                    onChange={handleChange2}
                  >
                    {funding_types(filteredLots).map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      <Row className="my-2">
        <h2>Matching Lots:</h2>
        <LotTable lots={filteredLots} />
      </Row>
    </Container>
  );
};
