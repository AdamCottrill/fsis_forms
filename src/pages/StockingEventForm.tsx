import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getLots,
  getStockingAdminUnits,
  getStockingPurposes,
  getTransitMethods,
  getReleaseMethods,
} from "../services/api";

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
    isPending: lotIsPending,
    error: lotError,
    data: serverLots,
  } = useQuery({ queryKey: ["lots"], queryFn: () => getLots() });

  const { data: stockingAdminUnits } = useQuery({
    queryKey: ["stocking-admin-units"],
    queryFn: () => getStockingAdminUnits(),
  });

  const { data: stockingPurposes } = useQuery({
    queryKey: ["stocking-purposes"],
    queryFn: () => getStockingPurposes(),
  });

  const { data: releaseMethods } = useQuery({
    queryKey: ["release-methods"],
    queryFn: () => getReleaseMethods(),
  });

  const { data: transitMethods } = useQuery({
    queryKey: ["transit-methods"],
    queryFn: () => getTransitMethods(),
  });

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

  const data = serverLots ? serverLots.results : [];
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

  if (lotIsPending) return "Loading...";

  if (lotError) return "An error has occurred: " + lotError.message;

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
        <h1>Stocking Event Form</h1>

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <Card className="my-1">
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

          <Card className="my-1">
            <Card.Header as="h5">Event Admin</Card.Header>
            <Card.Body>
              <Row className="my-2">
                <Col>
                  <Form.Group className="mb-3" controlId="stocking-admin-unit">
                    <Form.Label>Stocking Admin Unit</Form.Label>
                    <Form.Select aria-label="Select Admin Unit">
                      <option value="">---</option>
                      {stockingAdminUnits &&
                        stockingAdminUnits.map((x) => (
                          <option key={x.admin_unit_id} value={x.admin_unit_id}>
                            {x.admin_unit_name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="pulication-date">
                    <Form.Label>Publication Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Publication Date"
                      aria-describedby="publicationsDateHelpBlock"
                    />
                    <Form.Text id="publicationsDateHelpBlock" muted>
                      The date that this event can be made publicly available.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Card>
                <Card.Body>
                  <Card.Title>Stocking Purpose</Card.Title>

                  <p>Check all that apply:</p>

                  <Row className="my-2">
                    {stockingPurposes &&
                      stockingPurposes.map((x) => (
                        <Col className="mt-1" md={4} key={x.code}>
                          <Form.Check
                            inline
                            label={`${x.description} (${x.code})`}
                            name="stocking-purpose"
                            type="checkbox"
                            id={x.code}
                          />
                        </Col>
                      ))}
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Event Attributes</Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="stocking-date">
                    <Form.Label>Stocking Date</Form.Label>
                    <Form.Control type="date" placeholder="Stocking Date" />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="release-method">
                    <Form.Label>Releases Method</Form.Label>
                    <Form.Select aria-label="Select Release Method">
                      <option value="">---</option>
                      {releaseMethods &&
                        releaseMethods.map((x) => (
                          <option key={x.code} value={x.code}>
                            {`${x.description} (${x.code})`}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="transit-mortality">
                    <Form.Label>Transit Mortality</Form.Label>
                    <Form.Control type="number" placeholder="---" />
                  </Form.Group>
                </Col>
              </Row>

              <Card>
                <Card.Body>
                  <Card.Title>Transit Methods</Card.Title>

                  <p>Check all that apply:</p>

                  <Row className="my-2">
                    {transitMethods &&
                      transitMethods.map((x) => (
                        <Col className="mt-1" md={4} key={x.code}>
                          <Form.Check
                            inline
                            label={`${x.description} (${x.code})`}
                            name="transit-method"
                            type="checkbox"
                            id={x.code}
                          />
                        </Col>
                      ))}
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Spatial Attributes</Card.Header>
            <Card.Body>
              <ul>
                <li>Destination Waterbody</li>
                <li>Stocked Waterbody</li>
                <li>Stocking Site</li>
                <li>DD_LAT and DD_LON</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Fish Attributes</Card.Header>
            <Card.Body>
              <ul>
                <li>Number Stocked</li>
                <li>Development Stage</li>
                <li>Fish Age</li>
                <li>Fish Weight</li>
                <li>Total Biomass</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Fin Clips and Marks</Card.Header>
            <Card.Body>
              <ul>
                <li>Clip Flag</li>
                <ul>
                  <li>Fin Clips</li>
                  <li>Clip Retention</li>
                </ul>

                <li>Marking Flag</li>
                <ul>
                  <li>Tag Flag</li>
                  <li>OTC Flag</li>
                  <li>Brand Flag</li>
                  <li>FL. Dye Flag</li>
                  <li>Other Mark</li>
                </ul>
              </ul>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Tags Applied</Card.Header>
            <Card.Body>
              <Card.Text>
                This will a form set to capture the tags applied and their
                series
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Comments</Card.Header>
            <Card.Body>
              <ul>
                <li>Inventory Comments</li>
                <li>Marking Comments</li>
                <li>Stocking Comments</li>
              </ul>
            </Card.Body>
          </Card>

          <Row className="my-2">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Row>
        </Form>

        <Card className="my-1">
          <Card.Header as="h5">To dos</Card.Header>
          <Card.Body>
            <ul>
              <li>Publication Date</li>
              <li>Admin Unit</li>
              <li>How</li>
              <li>When</li>
              <li>Comments</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
