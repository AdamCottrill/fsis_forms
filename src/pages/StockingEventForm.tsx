import { useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { ClickableMap } from "../components/ClickableMap";
import { AccordionToggle } from "../components/AccordionToggle";
import Loading from "../components/Loading";

import { RHFAsyncSelect } from "../components/RHFAsyncSelect";
import { RHFInput } from "../components/RHFInput";
import { RHFSelect } from "../components/RHFSelect";
import { RHFTextArea } from "../components/RHFTextArea";
import { ShowLotAttributes } from "../components/ShowLotAttributes";
import { LotLocator } from "../components/LotLocator";
import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";

import { getStockingSites } from "../hooks/useStockingSites";

import { getWaterbodies } from "../hooks/useWaterbody";
import { useDevelopmentStages } from "../hooks/useDevelopmentStages";
import { useFinClips } from "../hooks/useFinClips";
import { useReleaseMethods } from "../hooks/useReleaseMethods";
import { useTransitMethods } from "../hooks/useTransitMethods";
import { useLots } from "../hooks/useLots";
import { useProponents } from "../hooks/useProponents";
import { useTagTypes } from "../hooks/useTagTypes";
import { useTagColours } from "../hooks/useTagColours";
import { useTagOrigins } from "../hooks/useTagOrigins";
import { useTagPositions } from "../hooks/useTagPositions";
import { useStockingPurposes } from "../hooks/useStockingPurpose";
import { useStockingAdminUnits } from "../hooks/useStockingAdminUnits";

import { DataDictOverlay } from "../components/DataDictOverlay";

interface SiteOption {
  readonly value: string;
  readonly label: string;
}

interface StockingEventFormInputs {
  lot_slug: string;
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
  const [show, setShow] = useState(false);

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const isFetching = useIsFetching();

  //const [state, dispatch] = useReducer(reducer, {});

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

  const developmentStages = useDevelopmentStages();
  const { data: finClips } = useFinClips();
  const proponents = useProponents();
  const releaseMethods = useReleaseMethods();
  const transitMethods = useTransitMethods();
  const tagTypes = useTagTypes();
  const tagColours = useTagColours();
  const tagOrigins = useTagOrigins();
  const tagPositions = useTagPositions();
  const stockingPurposes = useStockingPurposes();
  const stockingAdminUnits = useStockingAdminUnits();

  const lotData = useLots();

  const {
    control,
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockingEventFormInputs>(default_values);

  const [lot_slug] = watch(["lot_slug"]);
  const setSelectedLot = (slug) => setValue("lot_slug", slug);

  //const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const onSubmit = (values) => {
    console.log("Values:::", values);
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  //=============================================================

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

  const selectLotOptions = lotData
    ? lotData.map((x) => ({
        value: x.slug,
        label: x.slug,
      }))
    : [];

  const stockingAdminUnitOptions = stockingAdminUnits
    ? stockingAdminUnits.map((x) => ({
        value: x.admin_unit_id,
        label: x.admin_unit_name,
      }))
    : [];

  const proponentOptions = proponents || [];

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <h1>Stocking Event Form</h1>
          <RequiredFieldsMsg />

          <Loading isFetching={isFetching} />

          <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
            <Card className="my-1">
              <Card.Header as="h2">
                <Row>
                  <Col>
                    <div className="h5">Lot</div>
                  </Col>
                  <Col>
                    <Button
                      className="float-end"
                      size="sm"
                      onClick={handleModalShow}
                    >
                      Lot Locator
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row className="my-2">
                  <Col>
                    <RHFSelect
                      control={control}
                      name="lot_slug"
                      db_table_name="stocking_lot"
                      popup_placement="left"
                      label="Lot Identifier"
                      required={true}
                      options={selectLotOptions}
                      placeholderText="Select Lot Identifier..."
                      rules={{ required: "Lot identifier is required." }}
                      errors={errors}
                      fgClass="mb-3"
                    />
                  </Col>
                </Row>

                {lot_slug && (
                  <ShowLotAttributes lots={lotData} selectedLot={lot_slug} />
                )}
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
                      db_table_name="stocking_stockingadminunit"
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
                      db_field_name="publication_date"
                      popup_placement="left"
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
                    <Card.Title>
                      Stocking Purpose
                      <DataDictOverlay
                        db_table_name="stocking_stockingpurpose"
                        popup_placement="right"
                      />
                    </Card.Title>

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
                              value={x.code}
                              {...register(`stocking_purpose_${x.code}`)}
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
                  <Col>
                    <RHFSelect
                      control={control}
                      name="proponent_id"
                      db_table_name="stocking_proponent"
                      label="Proponent"
                      required={true}
                      options={proponentOptions}
                      rules={{
                        required: "Proponent is required.",
                      }}
                      errors={errors}
                      fgClass="mb-2"
                    />
                  </Col>

                  <Col md={4}>
                    <RHFInput
                      control={control}
                      name="stocking_date"
                      label="Stocking Date"
                      db_field_name="stocking_event_datetime"
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
                      db_table_name="stocking_releasemethod"
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
                </Row>

                <Row>
                  <Col>
                    <RHFInput
                      control={control}
                      name="transit_mortality"
                      db_field_name="transit_mortality_count"
                      label="Transit Mortality"
                      rules={{
                        required: "Transit Mortality is required.",
                        min: { value: 0, message: "Must be greater than 0" },
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="site_temperature"
                      db_field_name="site_temperature"
                      label="Site Temperature (&deg;C)"
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

                  <Col>
                    <RHFInput
                      control={control}
                      name="water_depth"
                      db_field_name="water_depth"
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
                    <Card.Title>
                      Transit Methods
                      <DataDictOverlay
                        db_table_name="stocking_transitmethod"
                        popup_placement="right"
                      />
                    </Card.Title>

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
                              value={x.code}
                              {...register(`transit_method_${x.code}`)}
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
                      <RHFAsyncSelect
                        control={control}
                        name="destination_waterbody"
                        label="Destination Waterbody"
                        db_table_name="stocking_waterbody"
                        popup_placement="right"
                        loadOptions={loadDestinationWaterbodyOptions}
                        onInputChange={selectDestinationWaterbodyChange}
                        required={true}
                        placeholderText="Start typing to see waterbodies"
                        rules={{
                          required: "Destination Waterbody is required.",
                        }}
                        errors={errors}
                        fgClass="mb-3"
                      />
                    </Row>

                    <Row>
                      <RHFAsyncSelect
                        control={control}
                        name="stocked_waterbody"
                        label="Stocked Waterbody"
                        db_table_name="stocking_waterbody"
                        popup_placement="right"
                        loadOptions={loadStockedWaterbodyOptions}
                        onInputChange={selectStockedWaterbodyChange}
                        required={true}
                        placeholderText="Start typing to see waterbodies"
                        rules={{
                          required: "Stocked Waterbody is required.",
                        }}
                        errors={errors}
                        fgClass="mb-3"
                      />
                    </Row>

                    <Row>
                      <RHFAsyncSelect
                        control={control}
                        name="stocking_site"
                        label="Stocking Site"
                        db_table_name="stocking_stockingsite"
                        popup_placement="right"
                        loadOptions={loadStockingSiteOptions}
                        onInputChange={selectStockingSiteChange}
                        required={true}
                        placeholderText="Start typing to see stocking sites"
                        rules={{
                          required: "Stocking Site is required.",
                        }}
                        errors={errors}
                        fgClass="mb-3"
                      />
                    </Row>
                    <Row>
                      <Col>
                        <RHFInput
                          control={control}
                          name="dd_lat"
                          db_field_name="latitude_decimal_degrees"
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
                          db_field_name="longitude_decimal_degrees"
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
                      db_field_name="fish_stocked_count"
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
                      db_field_name="fish_weight"
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
                      db_field_name="record_biomass_calc"
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
                      db_field_name="fish_age"
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
                      db_table_name="stocking_developmentstage"
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
                    <Card.Title>
                      Fin Clips
                      <DataDictOverlay
                        db_table_name="stocking_finclip"
                        popup_placement="right"
                      />
                    </Card.Title>

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
                                value={x.code}
                                {...register(`fin_clip_${x.code}`)}
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
                          db_field_name="clip_retention_pct"
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
                          {...register("oxytetracycline")}
                        />
                      </Col>

                      <Col>
                        <Form.Check // prettier-ignore
                          type="checkbox"
                          id="brand-flag"
                          label="Brand"
                          {...register("brand")}
                        />
                      </Col>

                      <Col>
                        <Form.Check // prettier-ignore
                          type="checkbox"
                          id="fl-dye-flag"
                          label="Fluorescent Dye"
                          {...register("fluorescent_dye")}
                        />
                      </Col>

                      <Col>
                        <Form.Check // prettier-ignore
                          type="checkbox"
                          id="other_mark"
                          label="Other"
                          {...register("other_mark")}
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
                              db_field_name="series_start"
                              label="Tag Series Start"
                              errors={errors}
                              fgClass="mb-3"
                            />
                          </Col>

                          <Col md={3}>
                            <RHFInput
                              control={control}
                              name="tag_series_end_1"
                              db_field_name="series_end"
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
                              db_table_name="stocking_tagtype"
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
                              db_table_name="stocking_tagcolour"
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
                              db_table_name="stocking_tagposition"
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
                              db_table_name="stocking_tagorigin"
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
                              db_field_name="retention_rate_pct"
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
                              db_field_name="retention_rate_sample_size"
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
                              db_field_name="retention_rate_pop_size"
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
                    <RHFTextArea
                      control={control}
                      name="inventory_comments"
                      db_field_name="inventory_comments"
                      popup_placement="left"
                      label="Inventory Comments"
                      errors={errors}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />

                    <RHFTextArea
                      control={control}
                      name="marking_comments"
                      db_field_name="marking_comments"
                      popup_placement="left"
                      label="Marking Comments"
                      errors={errors}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />

                    <RHFTextArea
                      control={control}
                      name="stocking_comments"
                      db_field_name="stocking_comments"
                      popup_placement="left"
                      label="Stocking Comments"
                      errors={errors}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />
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

        <Modal show={show} onHide={handleModalClose} fullscreen={true}>
          <Modal.Header closeButton>
            <Modal.Title>Lot Locator</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LotLocator
              selectedLot={lot_slug}
              setSelectedLot={setSelectedLot}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};
