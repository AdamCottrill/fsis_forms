import { useState, useRef } from "react";
import { useIsFetching } from "@tanstack/react-query";

import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import { ClickableMap } from "../components/ClickableMap";
import { AccordionToggle } from "../components/AccordionToggle";
import Loading from "../components/Loading";

import { RHFAsyncSelect } from "../components/RHFAsyncSelect";
import { RHFInput } from "../components/RHFInput";
import { RHFInlineInput } from "../components/RHFInlineInput";
import { RHFSelect } from "../components/RHFSelect";
import { RHFTextArea } from "../components/RHFTextArea";
import { RHFCheckBoxArray } from "../components/RHFCheckBoxArray";
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

import { StockingEventSchema } from "../schemas/StockingEventSchema";
import { StockingEventInputs } from "../types/types";
import Collapse from "react-bootstrap/esm/Collapse";

interface SiteOption {
  readonly value: string;
  readonly label: string;
}

export const StockingEventForm = (props) => {
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

  const applied_tags_defaults = {
    series_start: "",
    series_end: "",
    tag_type: "",
    tag_colour: "",
    tag_placement: "",
    tag_origin: "",
    retention_rate_pct: "",
    retention_rate_sample_size: "",
    retention_rate_pop_size: "",
  };

  const default_values = {
    lot_slug: "",
    stocking_admin_unit_id: null,
    publication_date: "",
    stocking_purposes: [],
    proponent_id: "",
    release_method: "",
    //stocking_date: Date;
    stocking_date: "",
    // stocking_time: time!!
    transit_mortality: "",
    site_temperature: "",
    rearing_temperature: "",
    water_depth: "",
    transit_methods: [],
    destination_waterbody: "",
    stocked_waterbody: "",
    //stocking_site: "",
    stocking_site: "",
    latitude_decimal_degrees: "",
    longitude_decimal_degrees: "",
    fish_stocked_count: "",
    fish_weight: "",
    total_biomass: "",
    fish_age: "",
    development_stage_id: "",
    fin_clips: [],
    clip_retention_pct: "",
    tags_applied: [{ ...applied_tags_defaults }],
    inventory_comments: "",
    marking_comments: "",
    stocking_comments: "",

    // these are some current fields that we may or may not need:
    oxytetracycline: false,
    brand: false,
    fluorescent_dye: false,
    other_marks: false,
    other_marks_description: "",
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

  const results = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<StockingEventInputs>({
    defaultValues: default_values,
    resolver: zodResolver(StockingEventSchema),
  });

  const submittedData = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags_applied",
  });

  const [lot_slug, other_marks] = watch(["lot_slug", "other_marks"]);
  const setSelectedLot = (slug) => setValue("lot_slug", slug);

  const onSubmit = (values) => {
    console.log("Values:::", values);
    results.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onError = (error) => {
    const values = getValues();
    console.log("FORM_VALUES:::", values);
    console.log("DEV_MSG_ERROR:::", error);
  };

  const handleReset = () => {
    reset({ default_values });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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

  const createPoint = (point_attrs: Pt) => {
    setPoint([...point_attrs]);
    reset({
      dd_lat: point_attrs[0],
      dd_lon: point_attrs[1],
    });
    trigger(["latitude_decimal_degrees", "longitude_decimal_degrees"]);
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
          <h1 className="mt-4">Stocking Event Form</h1>
          <RequiredFieldsMsg />

          <Loading isFetching={isFetching} />

          <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            onReset={handleReset}
          >
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
                      error_message={errors?.lot_slug?.message}
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
                      error_message={errors?.stocking_admin_unit_id?.message}
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
                      error_message={errors?.publication_date?.message}
                      fgClass="mb-3"
                      helpText="The date that this event can be made publicly available."
                      rules={{ deps: ["stocking_date"] }}
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

                    {stockingPurposes && (
                      <RHFCheckBoxArray
                        options={stockingPurposes}
                        control={control}
                        name="stocking_purposes"
                        errors={errors}
                      />
                    )}
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
                      error_message={errors?.proponent_id?.message}
                      fgClass="mb-2"
                    />
                  </Col>

                  <Col md={4}>
                    <RHFInput
                      control={control}
                      name="stocking_date"
                      label="Stocking Date"
                      db_field_name="stocking_event_datetime"
                      required={true}
                      inputType="date"
                      error_message={errors?.stocking_date?.message}
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
                      error_message={errors?.release_method?.message}
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
                      error_message={errors?.transit_mortality?.message}
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="site_temperature"
                      db_field_name="stocking_site_temperature"
                      label="Site Temperature (&deg;C)"
                      error_message={errors?.site_temperature?.message}
                      fgClass="mb-3"
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="water_depth"
                      db_field_name="stocking_water_depth"
                      label="Water Depth (m)"
                      error_message={errors?.water_depth?.message}
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
                    {transitMethods && (
                      <RHFCheckBoxArray
                        options={transitMethods}
                        control={control}
                        name="transit_methods"
                        errors={errors}
                      />
                    )}
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
                        error_message={errors?.destination_waterbody?.message}
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
                        error_message={errors?.stocked_waterbody?.message}
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
                        error_message={errors?.stocking_site?.message}
                        fgClass="mb-3"
                      />
                    </Row>
                    <Row>
                      <Col>
                        <RHFInput
                          control={control}
                          name="latitude_decimal_degrees"
                          db_field_name="latitude_decimal_degrees"
                          label="Latitude"
                          inputType="number"
                          error_message={
                            errors?.latitude_decimal_degrees?.message
                          }
                          fgClass="mb-3"
                          helpText="Dec. Degrees North"
                          placeholderText=""
                          rules={{ deps: ["longitude_decimal_degrees"] }}
                        />
                      </Col>
                      <Col>
                        <RHFInput
                          control={control}
                          name="longitude_decimal_degrees"
                          label="Longitude"
                          db_field_name="longitude_decimal_degrees"
                          inputType="number"
                          error_message={
                            errors?.longitude_decimal_degrees?.message
                          }
                          fgClass="mb-3"
                          helpText="Dec. Degrees West"
                          placeholderText=""
                          rules={{ deps: ["latitude_decimal_degrees"] }}
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
                      name="fish_stocked_count"
                      db_field_name="fish_stocked_count"
                      label="Number of Fish Stocked"
                      inputType="number"
                      error_message={errors?.fish_stocked_count?.message}
                      fgClass="mb-3"
                      required={true}
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="fish_weight"
                      db_field_name="fish_weight"
                      label="Fish Weight (g)"
                      inputType="number"
                      error_message={errors?.fish_weight?.message}
                      fgClass="mb-3"
                      helpText="Average weight in grams of an individual fish."
                    />
                  </Col>

                  <Col>
                    <RHFInput
                      control={control}
                      name="total_biomass"
                      db_field_name="record_biomass_calc"
                      label="Total Biomass (kg)"
                      inputType="number"
                      error_message={errors?.total_biomass?.message}
                      fgClass="mb-3"
                      helpText="Total biomass in kilograms of all stocked fish."
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
                      error_message={errors?.fish_age?.message}
                      fgClass="mb-3"
                      helpText="The age of the fish (in months) at time of stocking."
                    />
                  </Col>

                  <Col>
                    <RHFSelect
                      control={control}
                      name="development_stage_id"
                      label="Development Stage"
                      db_table_name="stocking_developmentstage"
                      options={developmentStages}
                      required={true}
                      error_message={errors?.development_stage_id?.message}
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

                      {finClips && (
                        <RHFCheckBoxArray
                          options={finClips}
                          control={control}
                          name="fin_clips"
                          errors={errors}
                        />
                      )}
                    </Row>

                    <Row>
                      <Col md={3}>
                        <RHFInput
                          control={control}
                          name="clip_retention_pct"
                          db_field_name="clip_retention_pct"
                          label="Clip Retention (%)"
                          inputType="number"
                          error_message={errors?.clip_retention_pct?.message}
                          fgClass="mb-3"
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="my-1">
                  <Card.Body>
                    <Card.Title>Marks and Brands</Card.Title>

                    <Row>
                      <p>Were these fish marked in some way?</p>
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

                      <Col xs={6}>
                        <Row>
                          <Col sm={3}>
                            <Form.Check // prettier-ignore
                              type="checkbox"
                              id="other_marks"
                              {...register("other_marks")}
                              label="Other Marks"
                            />
                          </Col>

                          <Col>
                            <RHFInlineInput
                              control={control}
                              name="other_marks_description"
                              label="Other Marks Description"
                              inputType="text"
                              placeholderText="Please Specify"
                              disabled={!other_marks}
                              error_message={
                                errors?.other_marks_description?.message
                              }
                              fgClass="mb-3"
                            />
                          </Col>
                        </Row>
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
                  <Card.Body data-testid="applied-tags">
                    {fields.map((item, index) => (
                      <Card className="my-1" key={item.id}>
                        <Card.Header>
                          <Row className="justify-end">
                            <Col>Applied Tag {index + 1}</Col>
                            <Col md={1}>
                              <Button
                                variant="danger"
                                type="button"
                                size="sm"
                                onClick={() => remove(index)}
                                aria-label={`Delete Applied Tag ${index + 1}`}
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={3}>
                              <RHFInput
                                control={control}
                                name={`tags_applied.${index}.series_start`}
                                db_field_name="series_start"
                                label="Tag Series Start"
                                //errors?.tags_applied?.[index]?.series_start.message
                                error_message={
                                  errors?.tags_applied?.[index]?.series_start
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>

                            <Col md={3}>
                              <RHFInput
                                control={control}
                                name={`tags_applied.${index}.series_end`}
                                db_field_name="series_end"
                                label="Tag Series End"
                                error_message={
                                  errors?.tags_applied?.[index]?.series_end
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              <RHFSelect
                                control={control}
                                name={`tags_applied.${index}.tag_type`}
                                db_table_name="stocking_tagtype"
                                label="Tag Type"
                                options={tagTypes}
                                error_message={
                                  errors?.tags_applied?.[index]?.tag_type
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>
                            <Col>
                              <RHFSelect
                                control={control}
                                name={`tags_applied.${index}.tag_colour`}
                                db_table_name="stocking_tagcolour"
                                label="Tag Colour"
                                options={tagColours}
                                error_message={
                                  errors?.tags_applied?.[index]?.tag_colour
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>

                            <Col>
                              <RHFSelect
                                control={control}
                                name={`tags_applied.${index}.tag_placement`}
                                db_table_name="stocking_tagposition"
                                label="Tag Position"
                                options={tagPositions}
                                error_message={
                                  errors?.tags_applied?.[index]?.tag_placement
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>

                            <Col>
                              <RHFSelect
                                control={control}
                                name={`tags_applied.${index}.tag_origin`}
                                db_table_name="stocking_tagorigin"
                                label="Tag Origin"
                                options={tagOrigins}
                                error_message={
                                  errors?.tags_applied?.[index]?.tag_origin
                                    ?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md={3}>
                              <RHFInput
                                control={control}
                                name={`tags_applied.${index}.retention_rate_pct`}
                                label="Tag Retention (%)"
                                db_field_name="retention_rate_pct"
                                inputType="number"
                                error_message={
                                  errors?.tags_applied?.[index]
                                    ?.retention_rate_pct?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>

                            <Col md={3}>
                              <RHFInput
                                control={control}
                                name={`tags_applied.${index}.retention_rate_sample_size`}
                                label="Tag Retention Sample Size"
                                db_field_name="retention_rate_sample_size"
                                inputType="number"
                                error_message={
                                  errors?.tags_applied?.[index]
                                    ?.retention_rate_sample_size?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>

                            <Col md={3}>
                              <RHFInput
                                control={control}
                                name={`tags_applied.${index}.retention_rate_pop_size`}
                                db_field_name="retention_rate_pop_size"
                                label="Tag Retention Population Size"
                                inputType="number"
                                error_message={
                                  errors?.tags_applied?.[index]
                                    ?.retention_rate_pop_size?.message
                                }
                                fgClass="mb-3"
                              />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}

                    <Row className="mt-2">
                      <Col md={3}>
                        <Button onClick={() => append(applied_tags_defaults)}>
                          Add Another Tag
                        </Button>
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
                      error_message={errors?.inventory_comments?.message}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />

                    <RHFTextArea
                      control={control}
                      name="marking_comments"
                      db_field_name="marking_comments"
                      popup_placement="left"
                      label="Marking Comments"
                      error_message={errors?.marking_comments?.message}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />

                    <RHFTextArea
                      control={control}
                      name="stocking_comments"
                      db_field_name="stocking_comments"
                      popup_placement="left"
                      label="Stocking Comments"
                      error_message={errors?.stocking_comments?.message}
                      fgClass="mb-3"
                      style={{ height: "100px" }}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Row className="my-4 justify-content-between">
              <Col md={2}>
                <Button variant="outline-primary" onClick={handleReset}>
                  Reset Form
                </Button>
              </Col>

              <Col md={1}>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
            <DevTool control={control} /> {/* set up the dev tool */}
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

        <div ref={results}>
          {isSubmitSuccessful && (
            <Card border="success" className="my-2">
              <Card.Header>Success!</Card.Header>
              <Card.Body>
                <Card.Title>
                  This data would have been sent to the server:{" "}
                </Card.Title>
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>
    </>
  );
};
