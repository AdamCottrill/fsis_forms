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
  getWaterbodies,
} from "../services/api";

import Select from "react-select";
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

// create an key-value array of objects for drop-down lists in fsis-infinity forms
const get_code_labels = (data, code, label, descending = false) => {
  const sort_order = descending === false ? 1 : -1;
  const tmp = new Map(
    data.map((x) => [
      x[code],
      {
        code: x[code],
        label: label == code ? x[code] : `${x[label]} (${x[code]})`,
      },
    ]),
  );
  const code_labels = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 * sort_order : -1 * sort_order,
  );
  return code_labels;
};

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

  if (lotIsPending) return "Loading...";

  if (lotError) return "An error has occurred: " + lotError.message;

  const lotData = serverLots ? serverLots.results : [];
  // convert spawn year to a string so our filters all work:
  lotData.forEach((d) => (d.spawn_year = d.spawn_year + ""));

  const filteredLots = lotData.filter((item) =>
    Object.entries(lotFilters).every(([key, value]) => item[key] === value),
  );

  const spawnYears = get_code_labels(
    filteredLots,
    "spawn_year",
    "spawn_year",
    true,
  );
  const lot_nums = get_code_labels(filteredLots, "lot_num", "lot_num");
  const funding_types = get_code_labels(
    filteredLots,
    "funding_type",
    "funding_type",
  );

  const species = get_code_labels(filteredLots, "species_code", "species_name");
  const strains = get_code_labels(filteredLots, "strain_slug", "strain_name");

  const proponents = get_code_labels(
    filteredLots,
    "proponent_abbrev",
    "proponent_name",
  );

  const hatcheries = get_code_labels(
    filteredLots,
    "rearing_location_abbrev",
    "rearing_location_name",
  );

  const selectChanged = (event, { name }) => {
    const { value } = event;
    if (value === "") {
      const current = { ...lotFilters };
      delete current[name];
      setLotFilters({ ...current });
    } else {
      setLotFilters({ ...lotFilters, [name]: value });
    }
  };

  const selectDestinationWaterbodyChange = (event) => {
    console.log(event);
  };

  const loadDestinationWaterbodyOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getWaterbodies(inputValue);
  };

  const selectStockedWaterbodyChange = (event) => {
    console.log(event);
  };

  const loadStockedWaterbodyOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getWaterbodies(inputValue);
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
        <Row className="justify-content-center">
          <h1>Stocking Event Form</h1>

          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Card className="my-1">
              <Card.Header as="h5">Lot</Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col>
                    <Select
                      placeholder="Select Lot Identifier..."
                      options={filteredLots}
                      isLoading={!filteredLots}
                      name={"lot_slug_select"}
                      closeMenuOnSelect={true}
                      getOptionLabel={(option) => option.slug}
                      getOptionValue={(option) => option.id}
                    />
                  </Col>
                  <Col>
                    <Select
                      placeholder="Select Lot Number..."
                      options={lot_nums}
                      isLoading={!lot_nums}
                      name="lot_num"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>
                </Row>

                <Row className="my-2">
                  <Col>
                    <Select
                      placeholder="Select Species..."
                      options={species}
                      isLoading={!species}
                      name="species"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>

                  <Col>
                    <Select
                      placeholder="Select Strain..."
                      options={strains}
                      isLoading={!strains}
                      name="strain_slug"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>

                  <Col>
                    <Select
                      placeholder="Select Spawn Year..."
                      options={spawnYears}
                      isLoading={!spawnYears}
                      name="spawn_year"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>
                </Row>

                <Row className="my-2">
                  <Col>
                    <Select
                      placeholder="Select Proponent..."
                      options={proponents}
                      isLoading={!proponents}
                      name="proponent_abbrev"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>
                  <Col>
                    <Select
                      placeholder="Select Rearing Location..."
                      options={hatcheries}
                      isLoading={!hatcheries}
                      name="rearing_type_abbrev"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>
                  <Col>
                    <Select
                      placeholder="Select Funding Type..."
                      options={funding_types}
                      isLoading={!funding_types}
                      name="funding_type"
                      closeMenuOnSelect={true}
                      onChange={selectChanged}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="my-1">
              <Card.Header as="h5">Event Admin</Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="stocking-admin-unit"
                    >
                      <Form.Label>Stocking Admin Unit</Form.Label>

                      <Select
                        placeholder="---"
                        options={stockingAdminUnits}
                        isLoading={!stockingAdminUnits}
                        closeMenuOnSelect={true}
                        getOptionValue={(option) => option.admin_unit_id}
                        getOptionLabel={(option) => option.admin_unit_name}
                      />
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

                    <Row>
                      {stockingPurposes &&
                        stockingPurposes.map((x) => (
                          <Col className="mb-1" md={4} key={x.code}>
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

                      <Select
                        placeholder="---"
                        options={releaseMethods}
                        isLoading={!releaseMethods}
                        closeMenuOnSelect={true}
                        getOptionValue={(option) => option.code}
                        getOptionLabel={(option) =>
                          `${option.description} (${option.code})`
                        }
                      />
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

                    <Row>
                      {transitMethods &&
                        transitMethods.map((x) => (
                          <Col className="mb-1" md={4} key={x.code}>
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
                        <AsyncSelect
                          defaultOptions={[]}
                          loadOptions={loadDestinationWaterbodyOptions}
                          onChange={selectDestinationWaterbodyChange}
                          placeholder="Start typing to see waterbodies"
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="stocked-waterbody"
                      >
                        <Form.Label>Stocked Waterbody</Form.Label>
                        <AsyncSelect
                          defaultOptions={[]}
                          loadOptions={loadStockedWaterbodyOptions}
                          onChange={selectStockedWaterbodyChange}
                          placeholder="Start typing to see waterbodies"
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group className="mb-3" controlId="stocking-site">
                        <Form.Label>Stocking Site</Form.Label>
                        <AsyncSelect
                          defaultOptions={[]}
                          loadOptions={loadSiteOptions}
                          onChange={selectSiteChange}
                          placeholder="Start typing to see Stocking Sites"
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
                            Dec. Degrees North
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
                            Dec. Degrees East
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
                        Total biomass in kilograms of all stocked fish.
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
                      <Select
                        placeholder="---"
                        options={developmentStages}
                        isLoading={!developmentStages}
                        closeMenuOnSelect={true}
                        getOptionValue={(option) => option.code}
                        getOptionLabel={(option) =>
                          `${option.description} (${option.code})`
                        }
                      />
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

                    <Row className="my-2">
                      <p>Check all that apply:</p>

                      {finClips &&
                        finClips.map((x) => (
                          <Col className="mb-2" md={4} key={x.code}>
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

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="clip-retention">
                          <Form.Label>Clip Retention</Form.Label>
                          <Form.Control type="number" placeholder="---" />
                        </Form.Group>
                      </Col>
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
        </Row>
      </Container>
    </>
  );
};
