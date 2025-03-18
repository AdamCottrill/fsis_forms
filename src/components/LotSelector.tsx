
import React from "react";
import Select from "react-select";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { get_value_labels } from "../utils";

import {Lot} from "../services/types"

export const LotSelector = ({ lots }) => {
  let filteredLots = [];
  let lotFilters = {};

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

  filteredLots = filterLots(lots, lotFilters);

  const spawnYears = get_value_labels(
    filteredLots,
    "spawn_year",
    "spawn_year",
    true,
  );

  const lot_nums = get_value_labels(filteredLots, "lot_num", "lot_num");

  const funding_types = get_value_labels(
    filteredLots,
    "funding_type",
    "funding_type",
  );

  const species = get_value_labels(
    filteredLots,
    "species_code",
    "species_name",
  );

  const strains = get_value_labels(filteredLots, "strain_slug", "strain_name");

  const proponents = get_value_labels(
    filteredLots,
    "proponent_abbrev",
    "proponent_name",
  );

  const hatcheries = get_value_labels(
    filteredLots,
    "rearing_location_abbrev",
    "rearing_location_name",
  );

  const selectChanged = (event, { name }) => {
    console.log(event, name);
    if (event === null) {
      const tmp = { ...lotFilters };
      delete tmp[name];
      lotFilters = { ...tmp };
      //dispatch({ type: "delete", name });
    } else {
      lotFilters = { ...lotFilters, [name]: event.value };
      //dispatch({ type: "change", name: name, value: event.value });
    }

    filteredLots = filterLots(lots, lotFilters);

    console.log(lotFilters);
    console.log(filteredLots);
    //console.log("state:", state);

    console.log(strains);

    // filteredLots = lots.filter((item) =>
    //   Object.entries(lotFilters).every(([key, value]) => item[key] === value),
    // );
  };

  const handleChange2 = (event) => {
    console.log(event.target.name, event.target.value);
  };

  return (
    <>
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
                    name="lot_nums"
                    onChange={handleChange2}
                  >
                    {lot_nums &&
                      lot_nums.map((x, i) => (
                        <option key={i} value={x.value}>
                          {x.slug}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-species">
                  <Form.Label>Species</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-species"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Species...
                      </div>
                    }
                    options={species}
                    isLoading={!species}
                    name="species_code"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-strain">
                  <Form.Label>Strain</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-strain"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Strain...
                      </div>
                    }
                    options={strains}
                    isLoading={strains}
                    name="strain_slug"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="select-spawn-year">
                  <Form.Label>Spawn Year</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-spawn-year"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Spawn Year...
                      </div>
                    }
                    options={spawnYears}
                    isLoading={!spawnYears}
                    name="spawn_year"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="my-2">
              <Col>
                <Form.Group className="mb-3" controlId="select-proponent">
                  <Form.Label>Proponent</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-proponent"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Proponent...
                      </div>
                    }
                    options={proponents}
                    isLoading={!proponents}
                    name="proponent_abbrev"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="select-rearing-location"
                >
                  <Form.Label>Rearing Location</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-rearing-location"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Rearing Location...
                      </div>
                    }
                    options={hatcheries}
                    isLoading={!hatcheries}
                    name="rearing_location_abbrev"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="select-funding-type">
                  <Form.Label>Funding Type</Form.Label>

                  <Select
                    isClearable={true}
                    inputId="select-funding-type"
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Funding Type...
                      </div>
                    }
                    options={funding_types}
                    isLoading={!funding_types}
                    name="funding_type"
                    closeMenuOnSelect={true}
                    onChange={selectChanged}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};
