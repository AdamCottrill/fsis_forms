import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useIsFetching } from "@tanstack/react-query";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";

import Loading from "../components/Loading";

import { RHFInput } from "../components/RHFInput";
import { RHFSelect } from "../components/RHFSelect";

import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";

import { useTagTypes } from "../hooks/useTagTypes";
import { useTagColours } from "../hooks/useTagColours";
import { useTagOrigins } from "../hooks/useTagOrigins";
import { useTagPositions } from "../hooks/useTagPositions";

import { AppliedTag } from "../types/types";

export const AppliedTags = () => {
  const isFetching = useIsFetching();

  const tagTypes = useTagTypes();
  const tagColours = useTagColours();
  const tagOrigins = useTagOrigins();
  const tagPositions = useTagPositions();

  const default_values = {
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppliedTag>({
    defaultValues: { tags_applied: [default_values] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags_applied",
  });

  const onSubmit = (values) => {
    console.log("Values:::", values);
  };

  const onError = (error) => {
    const values = getValues();
    console.log("FORM_VALUES:::", values);
    console.log("DEV_MSG_ERROR:::", error);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Applied Tags Form</h1>
        <RequiredFieldsMsg />

        <Loading isFetching={isFetching} />

        <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
          <Card className="my-2">
            <Card.Header as="h2">
              <div className="h5 mt-1">Tags Applied</div>
            </Card.Header>

            <Card.Body>
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
                          errors={errors}
                          fgClass="mb-3"
                        />
                      </Col>

                      <Col md={3}>
                        <RHFInput
                          control={control}
                          name={`tags_applied.${index}.series_end`}
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
                          name={`tags_applied.${index}.tag_type`}
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
                          name={`tags_applied.${index}.tag_colour`}
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
                          name={`tags_applied.${index}.tag_placement`}
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
                          name={`tags_applied.${index}.tag_origin`}
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
                          name={`tags_applied.${index}.retention_rate_pct`}
                          label="Tag Retention (%)"
                          db_field_name="retention_rate_pct"
                          inputType="number"
                          errors={errors}
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
                          errors={errors}
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
                          errors={errors}
                          fgClass="mb-3"
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <Row className="mt-2">
                <Col md={3}>
                  <Button onClick={() => append(default_values)}>
                    Add Another Tag
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="my-4 justify-content-end">
            <Col md={1}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <DevTool control={control} /> {/* set up the dev tool */}
    </Container>
  );
};
