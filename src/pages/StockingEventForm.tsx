import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDevelopmentStages,
  getFinClips,
  getLots,
  getReleaseMethods,
  getStockingAdminUnits,
  getStockingPurposes,
  getTransitMethods,
  getStockingSites,
} from "../services/api";

import AsyncSelect from "react-select/async";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { useForm, SubmitHandler } from "react-hook-form";

interface SiteOption {
  readonly value: string;
  readonly label: string;
}

export const StockingEventForm = () => {
  const [lotFilters, setLotFilters] = useState({});

  const {
    isPending: lotIsPending,
    error: lotError,
    data: serverLots,
  } = useQuery({ queryKey: ["lots"], queryFn: () => getLots() });

  const { data: developmentStages } = useQuery({
    queryKey: ["development-stages"],
    queryFn: () => getDevelopmentStages(),
  });

  const { data: finClips } = useQuery({
    queryKey: ["fin-clips"],
    queryFn: () => getFinClips(),
  });

  const { data: releaseMethods } = useQuery({
    queryKey: ["release-methods"],
    queryFn: () => getReleaseMethods(),
  });

  const { data: stockingAdminUnits } = useQuery({
    queryKey: ["stocking-admin-units"],
    queryFn: () => getStockingAdminUnits(),
  });

  const { data: stockingPurposes } = useQuery({
    queryKey: ["stocking-purposes"],
    queryFn: () => getStockingPurposes(),
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

  const selectSiteChange = (event) => {
    console.log(event);
  };

  const loadSiteOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getStockingSites(inputValue);
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
                    <Form.Label>Release Method</Form.Label>
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
              <Row>
                <Col md={3}>
                  <Row>
                    <Form.Group
                      className="mb-3"
                      controlId="destination-waterbody"
                    >
                      <Form.Label>Destination Waterbody</Form.Label>
                      <Form.Control type="number" placeholder="---" />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="stocked-waterbody">
                      <Form.Label>Stocked Waterbody</Form.Label>
                      <Form.Control type="number" placeholder="---" />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="stocking-site">
                      <Form.Label>Stocking Site</Form.Label>
                      <AsyncSelect
                        defaultOptions={[]}
                        loadOptions={loadSiteOptions}
                        onChange={selectSiteChange}
                        placeholder="Start typing to select Stocking Site"
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="latitude">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="---"
                          aria-describedby="latitudeHelpBlock"
                        />
                        <Form.Text id="latitudeHelpBlock" muted>
                          Decimal Degrees North
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="longitude">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="---"
                          aria-describedby="longitudeHelpBlock"
                        />
                        <Form.Text id="longitudeHelpBlock" muted>
                          Decimal Degrees East
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={9}>
                  <p>the map</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Fish Attributes</Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="number-stocked">
                    <Form.Label>Number Stocked</Form.Label>
                    <Form.Control type="number" placeholder="---" />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="fish-weight">
                    <Form.Label>Fish Weight (g)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="---"
                      aria-describedby="fishWeightHelpBlock"
                    />
                    <Form.Text id="fishWeightHelpBlock" muted>
                      Average weight in grams of an individual fish.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="total-biomass">
                    <Form.Label>Total Biomass (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="---"
                      aria-describedby="totalBiomassHelpBlock"
                    />
                    <Form.Text id="totalBiomassHelpBlock" muted>
                      Total biomass in kilogram of an all stocked fish.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="fish-age">
                    <Form.Label>Fish Age (g)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="---"
                      aria-describedby="fishAgeHelpBlock"
                    />
                    <Form.Text id="fishAgeHelpBlock" muted>
                      The age (in months) of the fish at time of stocking.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="development-stage">
                    <Form.Label>Development Stage</Form.Label>
                    <Form.Select aria-label="Select Development Stage">
                      <option value="">---</option>
                      {developmentStages &&
                        developmentStages.map((x) => (
                          <option key={x.code} value={x.code}>
                            {`${x.description} (${x.code})`}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Fin Clips and Marks</Card.Header>
            <Card.Body>
              <Card className="my-1">
                <Card.Body>
                  <Card.Title>Fin Clips</Card.Title>

                  <Row>
                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="clip-flag"
                        label="Were these fish clipped?"
                      />
                    </Col>

                    <Col>
                      <Form.Group className="mb-3" controlId="clip-retention">
                        <Form.Label>Clip Retention</Form.Label>
                        <Form.Control type="number" placeholder="---" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="my-2">
                    <p>Check all that apply:</p>

                    {finClips &&
                      finClips.map((x) => (
                        <Col className="mt-1" md={4} key={x.code}>
                          <Form.Check
                            inline
                            label={`${x.description} (${x.code}) [${x.fn2_code}]`}
                            name="fin-clips"
                            type="checkbox"
                            id={x.code}
                          />
                        </Col>
                      ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="my-1">
                <Card.Body>
                  <Card.Title>Marks and Brands</Card.Title>

                  <Row>
                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="mark-flag"
                        label="Were these fish marked?"
                      />
                    </Col>
                  </Row>

                  <Row className="my-2">
                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="OTC-flag"
                        label="Oxytetracycline (OTC)"
                      />
                    </Col>

                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="brand-flag"
                        label="Brand"
                      />
                    </Col>

                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="fl-dye-flag"
                        label="Fluorescent Dye"
                      />
                    </Col>

                    <Col>
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id="other_mark"
                        label="Other"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Tags Applied</Card.Header>
            <Card.Body>
              <Card.Text>
                This will be a formset to capture the tags applied and their
                series
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="my-1">
            <Card.Header as="h5">Comments</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3" controlId="inventory-comments">
                <Form.Label>Inventory Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder=""
                  style={{ height: "100px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="marking-comments">
                <Form.Label>Marking Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder=""
                  style={{ height: "100px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="stocking-comments">
                <Form.Label>Stocking Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder=""
                  style={{ height: "100px" }}
                />
              </Form.Group>
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
