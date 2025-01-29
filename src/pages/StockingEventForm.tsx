import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLots } from "../services/api";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { useForm, SubmitHandler } from "react-hook-form";

export const StockingEventForm = () => {
  const [lotFilters, setLotFilters] = useState({});
  //const [selectedSpecies, setSelectedSpecies] = useState("");
  // const [strains, setstrains] = useState([]);
  // const [proponents, setProponents] = useState([]);
  // const [hatcheries, setHatcheries] = useState([]);

  const {
    isPending,
    error,
    data: serverData,
  } = useQuery({ queryKey: ["lots"], queryFn: () => getLots() });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  //const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const onSubmit = (values) => {
    console.log("Values:::", values);
    console.log("Values:::", JSON.stringify(values));
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  let data = serverData ? serverData.results : [];
  // convert spawn year to a string so our filters all work:
  data.forEach((d) => (d.spawn_year = d.spawn_year + ""));

  const filteredData = data.filter((item) =>
    Object.entries(lotFilters).every(([key, value]) => item[key] === value),
  );

  const years = [...new Set(filteredData.map((x) => x.spawn_year))].sort(
    (a, b) => a > b,
  );
  const lot_nums = [...new Set(filteredData.map((x) => x.lot_num))].sort();
  const funding_types = [
    ...new Set(filteredData.map((x) => x.funding_type)),
  ].sort();

  let tmp = new Map(
    filteredData.map((x) => [
      x.species_code,
      { code: x.species_code, label: x.species_name },
    ]),
  );
  const species = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 : -1,
  );

  tmp = new Map(
    filteredData.map((x) => [
      x.proponent_abbrev,
      {
        code: x.proponent_abbrev,
        label: x.proponent_name,
      },
    ]),
  );
  const proponents = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 : -1,
  );

  tmp = new Map(
    filteredData.map((x) => [
      x.rearing_location_abbrev,
      {
        code: x.rearing_location_abbrev,
        label: x.rearing_location_name,
      },
    ]),
  );
  const hatcheries = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 : -1,
  );

  tmp = new Map(
    filteredData.map((x) => [
      x.strain_slug,
      {
        code: x.strain_slug,
        label: x.strain_name,
      },
    ]),
  );
  const strains = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 : -1,
  );

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const lotFilterChanged = (event) => {
    const { name, value } = event.target;
    if (value === "") {
      const current = { ...lotFilters };
      delete current[name];
      setLotFilters({ ...current });
    } else {
      setLotFilters({ ...lotFilters, [name]: value });
    }
  };

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <Card>
            <Card.Header as="h5">Lot</Card.Header>
            <Card.Body>
              <Row className="my-2">
                <Col>
                  <Form.Select aria-label="Select Lot">
                    <option>Select Lot</option>
                    {filteredData &&
                      filteredData.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.slug}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    aria-label="Select Lot Number"
                    onChange={lotFilterChanged}
                    name="lot_num"
                  >
                    <option value="">Select Lot Number</option>
                    {lot_nums &&
                      lot_nums.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>

              <Row className="my-2">
                <Col>
                  <Form.Select
                    aria-label="Select Species"
                    onChange={lotFilterChanged}
                    name="species_code"
                  >
                    <option>Select Species</option>
                    {species &&
                      species.map((x) => (
                        <option key={x.code} value={x.code}>
                          {x.label} ({x.code})
                        </option>
                      ))}
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Select
                    aria-label="Select Strain"
                    onChange={lotFilterChanged}
                    name="strain_slug"
                  >
                    <option>Select Strain</option>
                    {strains &&
                      strains.map((x) => (
                        <option key={x.code} value={x.code}>
                          {x.label} ({x.code})
                        </option>
                      ))}
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Select
                    aria-label="Select Spawn Year"
                    onChange={lotFilterChanged}
                    name="spawn_year"
                  >
                    <option value="">Select Spawn Year</option>
                    {years &&
                      years.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>

              <Row className="my-2">
                <Col>
                  <Form.Select
                    aria-label="Select Proponent"
                    onChange={lotFilterChanged}
                    name="proponent_abbrev"
                  >
                    <option value="">Select Proponent</option>
                    {proponents &&
                      proponents.map((x) => (
                        <option key={x.code} value={x.code}>
                          {x.label} ({x.code})
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    aria-label="Select Rearing Location"
                    onChange={lotFilterChanged}
                    name="rearing_location_abbrev"
                  >
                    <option value="">Select Rearing Location</option>
                    {hatcheries &&
                      hatcheries.map((x) => (
                        <option key={x.code} value={x.code}>
                          {x.label} ({x.code})
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    aria-label="Select Spawn Funding Type"
                    onChange={lotFilterChanged}
                    name="funding_type"
                  >
                    <option value="">Select Funding Type</option>
                    {funding_types &&
                      funding_types.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="my-2">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </Container>
    </>
  );
};
