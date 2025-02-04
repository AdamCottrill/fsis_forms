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
  getTagColours,
  getTagTypes,
  getTagPositions,
  getTagOrigins,
  getStockingSites,
  getWaterbodies,
} from "../services/api";

import Select from "react-select";
import AsyncSelect from "react-select/async";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { ClickableMap } from "../components/ClickableMap";
import { AccordionToggle } from "../components/AccordionToggle";
import { get_value_labels } from "../utils";
import { RHFSelect } from "../components/RHFSelect";
import { RHFInput } from "../components/RHFInput";

import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";

interface SiteOption {
  readonly value: string;
  readonly label: string;
}

interface StockingEventFormInputs {
  lot_id: number;
  stocking_admin_unit_id: number;
  release_method: number;
  development_stage: number;
  destination_waterbody: string;
  stocked_waterbody: string;
  stocking_site: string;
  dd_lat: string;
  dd_lon: string;
}

export const StockingEventForm = () => {
  const lotFilters = {};

  const [destinationWaterbody, setDestinationWaterbody] = useState("");
  const [stockedWaterbody, setStockedWaterbody] = useState("");
  const [stockingSite, setStockingSite] = useState("");

  const [point, setPoint] = useState([]);
  const [bounds, setBounds] = useState([
    [41.67, -95.15],
    [55.86, -74.32],
  ]);

  const default_values = {
    dd_lat: "",
    dd_lon: "",
  };

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

  const { data: tagTypes } = useQuery({
    queryKey: ["tag-types"],
    queryFn: () => getTagTypes(),
  });

  const { data: tagColours } = useQuery({
    queryKey: ["tag-colours"],
    queryFn: () => getTagColours(),
  });

  const { data: tagPositions } = useQuery({
    queryKey: ["tag-positions"],
    queryFn: () => getTagPositions(),
  });

  const { data: tagOrigins } = useQuery({
    queryKey: ["tag-origins"],
    queryFn: () => getTagOrigins(),
  });

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<StockingEventFormInputs>(default_values);

  //const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const onSubmit = (values) => {
    console.log("Values:::", values);
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  if (lotIsPending) return "Loading...";

  if (lotError) return "An error has occurred: " + lotError.message;

  const lotData = serverLots ? serverLots.results : [];
  // convert spawn year to a string so our filters all work:
  lotData.forEach((d) => (d.spawn_year = d.spawn_year + ""));

  let filteredLots = lotData.filter((item) =>
    Object.entries(lotFilters).every(([key, value]) => item[key] === value),
  );

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
    if (event === null) {
      delete lotFilters[name];
    } else {
      lotFilters = { ...lotFilters, [name]: event.value };
    }

    filteredLots = lotData.filter((item) =>
      Object.entries(lotFilters).every(([key, value]) => item[key] === value),
    );
  };

  const selectDestinationWaterbodyChange = (value) => {
    setDestinationWaterbody(value);
  };

  const loadDestinationWaterbodyOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getWaterbodies(inputValue);
  };

  const selectStockedWaterbodyChange = (value) => {
    setStockedWaterbody(value);
  };

  const loadStockedWaterbodyOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getWaterbodies(inputValue);
  };

  const selectStockingSiteChange = (value) => {
    setStockingSite(value);
  };

  const loadStockingSiteOptions = (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    return getStockingSites(inputValue);
  };

  const createPoint = (point_attrs) => {
    setPoint([...point_attrs]);
    reset({
      dd_lat: point_attrs[0],
      dd_lon: point_attrs[1],
    });
    trigger(["dd_lat", "dd_lon"]);
  };

  const selectLotOptions = filteredLots.map((x) => ({
    value: x.lot_id,
    label: x.slug,
  }));

  const stockingAdminUnitOptions = stockingAdminUnits.map((x) => ({
    value: x.admin_unit_id,
    label: x.admin_unit_name,
  }));

  console.log(errors);

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <h1>Stocking Event Form</h1>
          <RequiredFieldsMsg />
          <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
            <Card className="my-1">
              <Card.Header as="h2">
                <div className="h5">Lot</div>
              </Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col>
                    <RHFSelect
                      control={control}
                      name="lot_id"
                      label="Lot Identifier"
                      required={true}
                      options={selectLotOptions}
                      placeholderText="Select Lot Identifier..."
                      rules={{ required: "Lot identifier is required." }}
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="select-lot-number">
                      <Form.Label>Lot number</Form.Label>

                      <Select
                        isClearable={true}
                        inputId="select-lot-number"
                        placeholder={
                          <div className="select-placeholder-text">
                            Select Lot Number...
                          </div>
                        }
                        options={lot_nums}
                        isLoading={!lot_nums}
                        name="lot_num"
                        closeMenuOnSelect={true}
                        onChange={selectChanged}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="my-2">
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
                        isLoading={!strains}
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
                    <Form.Group
                      className="mb-3"
                      controlId="select-funding-type"
                    >
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

            <Card className="my-1">
              <Card.Header as="h2">
                <div className="h5">Event Admin</div>
              </Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col>
                    <RHFSelect
                      control={control}
                      name="stocking_admin_unit_id"
                      label="Stocking Admin Unit"
                      required={true}
                      options={stockingAdminUnitOptions}
                      rules={{
                        required: "Stocking Admin Unit ID is required.",
                      }}
                      errors={errors}
                      fgClass="mb-2"
                    />
                  </Col>
                  <Col>
                    <RHFInput
                      control={control}
                      name="publication_date"
                      label="Publication Date"
                      inputType="date"
                      errors={errors}
                      fgClass="mb-3"
                      helpText="The date that this event can be made publicly available."
                    />
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
              <Card.Header as="h2">
                <div className="h5">Event Attributes</div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={2}>
                    <RHFInput
                      control={control}
                      name="stocking_date"
                      label="Stocking Date"
                      rules={{
                        required: "Stocking Date is required.",
                      }}
                      required={true}
                      inputType="date"
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>

                  <Col>
                    <RHFSelect
                      control={control}
                      name="release_method"
                      label="Release Method"
                      required={true}
                      options={releaseMethods}
                      rules={{
                        required: "Release Method is required.",
                      }}
                      errors={errors}
                      fgClass="mb-2"
                    />
                  </Col>

                  <Col md={2}>
                    <RHFInput
                      control={control}
                      name="transit_mortality"
                      label="Transit Mortality"
                      rules={{
                        required: "Transit Mortality is required.",
                        max: { value: 100, message: "Must be less than 100" },
                        min: { value: 0, message: "Must be greater than 0" },
                      }}
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>

                  <Col md={2}>
                    <RHFInput
                      control={control}
                      name="site_temperature"
                      label="Site Temperature"
                      rules={{
                        max: { value: 30, message: "Must be less than 30" },
                        min: {
                          value: -10,
                          message: "Must be greater than -10",
                        },
                      }}
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>

                  <Col md={2}>
                    <RHFInput
                      control={control}
                      name="water_depth"
                      label="Water Depth (m)"
                      rules={{
                        max: { value: 300, message: "Must be less than 300 m" },
                        min: {
                          value: 0,
                          message: "Must be at least 0 m",
                        },
                      }}
                      errors={errors}
                      fgClass="mb-3"
                    />
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
                              control={control}
                            />
                          </Col>
                        ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            <Card className="my-1">
              <Card.Header as="h2">
                <div className="h5">Spatial Attributes</div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="select-destination-waterbody"
                      >
                        <Form.Label>Destination Waterbody</Form.Label>

                        <Controller
                          control={control}
                          name="destination_waterbody"
                          render={({ field: { value, ...field } }) => (
                            <AsyncSelect
                              {...field}
                              inputId="select-destination-waterbody"
                              defaultOptions={[]}
                              value={destinationWaterbody?.value}
                              loadOptions={loadDestinationWaterbodyOptions}
                              onInputChange={selectDestinationWaterbodyChange}
                              placeholder={
                                <div className="select-placeholder-text">
                                  Start typing to see waterbodies
                                </div>
                              }
                              className={
                                errors.destination_waterbody
                                  ? "react-select-error"
                                  : ""
                              }
                            />
                          )}
                          rules={{
                            required: "Destination Waterbody is required.",
                          }}
                        />

                        {errors.destination_waterbody && (
                          <div className="text-danger">
                            {errors.destination_waterbody?.message}
                          </div>
                        )}
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="select-stocked-waterbody"
                      >
                        <Form.Label>Stocked Waterbody</Form.Label>

                        <Controller
                          control={control}
                          name="stocked_waterbody"
                          render={({ field: { value, ...field } }) => (
                            <AsyncSelect
                              {...field}
                              inputId="select-stocked-waterbody"
                              defaultOptions={[]}
                              value={stockedWaterbody?.value}
                              loadOptions={loadStockedWaterbodyOptions}
                              onInputChange={selectStockedWaterbodyChange}
                              placeholder={
                                <div className="select-placeholder-text">
                                  Start typing to see waterbodies
                                </div>
                              }
                              className={
                                errors.stocked_waterbody
                                  ? "react-select-error"
                                  : ""
                              }
                            />
                          )}
                          rules={{ required: "Stocked Waterbody is required." }}
                        />

                        {errors.stocked_waterbody && (
                          <div className="text-danger">
                            {errors.stocked_waterbody?.message}
                          </div>
                        )}
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="select-stocking-site"
                      >
                        <Form.Label>Stocking Site</Form.Label>

                        <Controller
                          control={control}
                          name="stocking_site"
                          render={({ field: { value, ...field } }) => (
                            <AsyncSelect
                              {...field}
                              inputId="select-stocking-site"
                              defaultOptions={[]}
                              value={stockingSite?.value}
                              loadOptions={loadStockingSiteOptions}
                              onInputChange={selectStockingSiteChange}
                              placeholder={
                                <div className="select-placeholder-text">
                                  Start typing to see stocking sites
                                </div>
                              }
                              className={
                                errors.stocking_site ? "react-select-error" : ""
                              }
                            />
                          )}
                          rules={{ required: "Stocking Site is required" }}
                        />

                        {errors.stocking_site && (
                          <div className="text-danger">
                            {errors.stocking_site?.message}
                          </div>
                        )}
                      </Form.Group>
                    </Row>

                    <Row>
                      <Col>
                        <RHFInput
                          control={control}
                          name="dd_lat"
                          label="Latitude"
                          inputType="number"
                          errors={errors}
                          fgClass="mb-3"
                          helpText="Dec. Degrees North"
                          rules={{
                            max: {
                              value: bounds[1][0],
                              message: `dd_lat must but less than or equal to ${bounds[1][0]}`,
                            },
                            min: {
                              value: bounds[0][0],
                              message: `dd_lat must but greater than or equal to ${bounds[0][0]}`,
                            },
                          }}
                        />
                      </Col>
                      <Col>
                        <RHFInput
                          control={control}
                          name="dd_lon"
                          label="Longitude"
                          inputType="number"
                          errors={errors}
                          fgClass="mb-3"
                          helpText="Dec. Degrees West"
                          rules={{
                            max: {
                              value: bounds[1][1],
                              message: `dd_lon must but less than or equal to ${bounds[1][1]}`,
                            },
                            min: {
                              value: bounds[0][1],
                              message: `dd_lon must but greater than or equal to ${bounds[0][1]}`,
                            },
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={9}>
                    <ClickableMap
                      bounds={bounds}
                      point={point}
                      createPoint={createPoint}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="my-1">
              <Card.Header as="h2">
                <div className="h5">Fish Attributes</div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <RHFInput
                      control={control}
                      name="number_stocked"
                      label="Number of Fish Stocked"
                      inputType="number"
                      errors={errors}
                      fgClass="mb-3"
                      required={true}
                      rules={{
                        required: "Number Stocked is required.",
                        min: {
                          value: 1,
                          message:
                            "Number of fish stocked must be greater than 0.",
                        },
                      }}
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="fish_weight"
                      label="Fish Weight (g)"
                      inputType="number"
                      errors={errors}
                      fgClass="mb-3"
                      helpText="Average weight in grams of an individual fish."
                      rules={{
                        min: {
                          value: 0,
                          message: "Fish Weight must be greater than 0.",
                        },
                      }}
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="total_biomass"
                      label="Total Biomass (kg)"
                      inputType="number"
                      errors={errors}
                      fgClass="mb-3"
                      helpText="Total biomass in kilograms of all stocked fish."
                      rules={{
                        min: {
                          value: 0,
                          message: "Total Biomass must be greater than 0.",
                        },
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <RHFInput
                      control={control}
                      name="fish_age"
                      label="Fish Age"
                      inputType="number"
                      errors={errors}
                      fgClass="mb-3"
                      helpText="The age of the fish (in months) at time of stocking."
                      rules={{
                        min: {
                          value: 0,
                          message:
                            "Fish Age must be greater or equal to than 0.",
                        },
                      }}
                    />
                  </Col>

                  <Col>
                    <RHFSelect
                      control={control}
                      name="development_stage_id"
                      inputId="select-development-stage"
                      options={developmentStages}
                      label="Development Stage"
                      rules={{ required: "Development Stage is required." }}
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="my-1">
              <Card.Header as="h2">
                <div className="h5">Fin Clips and Marks</div>
              </Card.Header>
              <Card.Body>
                <Card className="my-1">
                  <Card.Body>
                    <Card.Title>Fin Clips</Card.Title>

                    <Row className="my-2">
                      <p>Check all that apply:</p>

                      <Row className="row-cols-4">
                        {finClips &&
                          finClips.map((x) => (
                            <Col className="mb-2" key={x.code}>
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
                    </Row>

                    <Row>
                      <Col md={3}>
                        <RHFInput
                          control={control}
                          name="clip_retention"
                          label="Clip Retention (%)"
                          inputType="number"
                          errors={errors}
                          fgClass="mb-3"
                          rules={{
                            min: {
                              value: 0,
                              message:
                                "Clip Retention must greater or equal to 0.",
                            },
                            max: {
                              value: 100,
                              message:
                                "Clip Retention must less than or equal to 100.",
                            },
                          }}
                        />
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

            <Accordion>
              <Card className="my-2">
                <Card.Header as="h2">
                  <AccordionToggle eventKey="tags-applied-card">
                    <div className="h5 mt-1">Tags Applied</div>
                  </AccordionToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="tags-applied-card">
                  <Card.Body>
                    <Card className="my-1">
                      <Card.Header>Applied Tag 1</Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_series_start_1"
                              label="Tag Series Start"
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>

                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_series_end_1"
                              label="Tag Series End"
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <RHFSelect
                              control={control}
                              name="tag_type_1"
                              label="Tag Type"
                              options={tagTypes}
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>
                          <Col>
                            <RHFSelect
                              control={control}
                              name="tag_colour_1"
                              label="Tag Colour"
                              options={tagColours}
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>

                          <Col>
                            <RHFSelect
                              control={control}
                              name="tag_position_1"
                              label="Tag Position"
                              options={tagPositions}
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>

                          <Col>
                            <RHFSelect
                              control={control}
                              name="tag_origin_1"
                              label="Tag Origin"
                              options={tagOrigins}
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_retention_1"
                              label="Tag Retention (%)"
                              inputType="number"
                              errors={errors}
                              fgClass="mb-3"
                              rules={{
                                min: {
                                  value: 0,
                                  message:
                                    "Tag Retention must greater or equal to 0.",
                                },
                                max: {
                                  value: 100,
                                  message:
                                    "Tag Retention must less than or equal to 100.",
                                },
                              }}
                            />
                          </Col>

                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_retention_sample_size_1"
                              label="Tag Retention Sample Size"
                              inputType="number"
                              errors={errors}
                              fgClass="mb-3"
                              rules={{
                                min: {
                                  value: 0,
                                  message:
                                    "Tag Retention Sample Size  must greater or equal to 0.",
                                },
                              }}
                            />
                          </Col>

                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_retention_population_size_1"
                              label="Tag Retention Population Size"
                              inputType="number"
                              errors={errors}
                              fgClass="mb-3"
                              rules={{
                                min: {
                                  value: 0,
                                  message:
                                    "Tag Retention Population Size  must greater or equal to 0.",
                                },
                              }}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <Row className="mt-2">
                      <Col md={2}>
                        {" "}
                        <Button>Add Another Tag</Button>{" "}
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <Accordion>
              <Card className="my-2">
                <Card.Header as="h2">
                  <AccordionToggle eventKey="comments-card">
                    <div className="h5 mt-1">Comments</div>
                  </AccordionToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="comments-card">
                  <Card.Body>
                    <Form.Group
                      className="mb-3"
                      controlId="select-inventory-comments"
                    >
                      <Form.Label>Inventory Comments</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        style={{ height: "100px" }}
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="select-marking-comments"
                    >
                      <Form.Label>Marking Comments</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        style={{ height: "100px" }}
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="select-stocking-comments"
                    >
                      <Form.Label>Stocking Comments</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        style={{ height: "100px" }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <Row className="my-4 justify-content-end">
              <Col md={1}>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </Container>
    </>
  );
};
