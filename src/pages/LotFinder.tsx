// return an empty page that will have form with just lot related elements:
import React from "react";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useQuery } from "@tanstack/react-query";
import { getLots } from "../services/api";

import { get_value_labels } from "../utils";

interface SelectChoice {
  label: string;
  value: string;
}

export const LotFinder = () => {
  const filterLots = (all_lots, filters) => {
    const lots =
      Object.keys(filters).length === 0
        ? all_lots
        : all_lots.filter((item) =>
            Object.entries(filters).every(
              ([key, value]) => item[key] === value,
            ),
          );
    return lots;
  };

  // get all of our lots:
  const {
    isPending: lotIsPending,
    error: lotError,
    data: serverLots,
  } = useQuery({ queryKey: ["lots"], queryFn: () => getLots() });

  const lotData = serverLots ? serverLots.results : [];
  // convert spawn year to a string so our filters all work:
  lotData.forEach((d) => (d.spawn_year = d.spawn_year + ""));

  let filteredLots = [...lotData];
  let lotFilters = {};

  const lot_nums = (): SelectChoice[] =>
    get_value_labels(filteredLots, "lot_num", "slug", false, "---");

  const species = (filteredLots): SelectChoice[] =>
    get_value_labels(
      filteredLots,
      "species_code",
      "species_name",
      false,
      "---",
    );

  const strains = (filteredLots): SelectChoice[] =>
    get_value_labels(filteredLots, "strain_slug", "strain_name", false, "---");

  const spawnYears = (): SelectChoice[] =>
    get_value_labels(filteredLots, "spawn_year", "spawn_year", true, "---");

  const proponents = (): SelectChoice[] =>
    get_value_labels(
      filteredLots,
      "proponent_abbrev",
      "proponent_name",
      false,
      "---",
    );

  const hatcheries = (): SelectChoice[] =>
    get_value_labels(
      filteredLots,
      "rearing_location_abbrev",
      "rearing_location_name",
      false,
      "---",
    );

  const funding_types = (): SelectChoice[] =>
    get_value_labels(
      filteredLots,
      "funding_type",
      "funding_type",
      false,
      "---",
    );

  const handleChange2 = (event) => {
    //console.log(event.target.name, event.target.value);
    const { name, value } = event.target;
    const tmp = { ...lotFilters };
    if (value === "") {
      delete tmp[name];
    } else {
      tmp[name] = value;
    }
    lotFilters = { ...tmp };
    console.log("filters: ", lotFilters);
    filteredLots = filterLots(lotData, lotFilters);

    lot_nums();
    species(filteredLots);
    strains(filteredLots);
    console.log(strains(filteredLots));
    spawnYears();
    proponents();
    hatcheries();
    funding_types();

    //setFilteredLots(filterLots(lotData, lotFilters));
    console.log("filteredLots", filteredLots);
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
                    {lot_nums().map((x) => (
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
                    {spawnYears().map((x) => (
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
                    {proponents().map((x) => (
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
                    {hatcheries().map((x) => (
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
                    {funding_types().map((x) => (
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
    </Container>
  );
};
