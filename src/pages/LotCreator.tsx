// return an empty page that will have form with just lot related elements:
import React, { useState } from "react";

import { useIsFetching } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { CreateLotFormInputs } from "../types/types";

import usePostLot from "../hooks/usePostLot";
import { Alert } from "../components/Alert";
import { RHFInput } from "../components/RHFInput";
import { RHFSelect } from "../components/RHFSelect";
import Loading from "../components/Loading";
import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";

import { useSpecies } from "../hooks/useSpecies";
import { useStrains } from "../hooks/useStrains";

import { useRearingLocations } from "../hooks/useRearingLocations";

export const LotCreator = () => {
  const navigate = useNavigate();

  const isFetching = useIsFetching();

  const [newSlug, setNewSlug] = useState("");
  const [serverErrors, setServerErrors] = useState("");

  const addLot = usePostLot();

  const default_values = {};

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateLotFormInputs>(default_values);

  const [selectedSpecies] = watch(["spc"]);

  const { data: species } = useSpecies();
  const strains = useStrains(selectedSpecies);

  const rearingLocations = useRearingLocations();

  const onSubmit = (values: CreateLotFormInputs) => {
    console.log("Values:::", values);
    //TODO: add {onSuccess: (data) => history.push(<somewhere>)}
    addLot.mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        setNewSlug(data.slug);
        setServerErrors("");
        // add data.slug to context and return to main page. Use value
        // in context to populate the form.
        // SuccessToast();
        window.location.href = "../";
      },
      onError: (error) => {
        console.log("ERROR2:::", error);
        setServerErrors(error.message);
      },
    });
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  const handleBackClick = (event) => {
    event.preventDefault();
    navigate("../");
  };

  return (
    <Container>
      <Loading isFetching={isFetching} />
      <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
        <Row className="justify-content-center">
          <Card className="my-4 px-0">
            <Card.Header as="h1">
              <div className="h2">Lot Creator</div>
            </Card.Header>

            <Container className="mx-2 my-4">
              {addLot.isError && (
                <Alert
                  variant="danger"
                  dismissible={true}
                  headingText="Server Response:"
                  message={
                    serverErrors
                      ? JSON.stringify(serverErrors)
                      : "An error has occured."
                  }
                />
              )}

              {addLot.isPending && (
                <Alert
                  variant="info"
                  dismissible={true}
                  headingText="Request Pending:"
                  message="Inserting the new Lot..."
                />
              )}

              {addLot.isSuccess && newSlug && (
                <Alert
                  variant="success"
                  dismissible={true}
                  headingText="Success!:"
                  message={`The new Lot (${newSlug}) has been created.`}
                />
              )}
            </Container>

            <Card.Body>
              <Row className="my-2">
                <Col>
                  <RHFSelect
                    control={control}
                    name="spc"
                    label="Species"
                    required={true}
                    options={species}
                    rules={{
                      required: "Species is required.",
                    }}
                    errors={errors}
                    fgClass="mb-2"
                  />
                </Col>

                <Col>
                  <RHFSelect
                    control={control}
                    name="species_strain_id"
                    label="Strain"
                    required={true}
                    options={strains}
                    isDisabled={!!!selectedSpecies}
                    rules={{
                      required: "Strain is required.",
                    }}
                    errors={errors}
                    fgClass="mb-2"
                  />
                </Col>

                <Col>
                  <RHFInput
                    control={control}
                    name="spawn_year"
                    label="Spawn Year"
                    required={true}
                    rules={{
                      required: "Spawn Year is required.",
                      min: {
                        value: 1950,
                        message: "Must be greater than 1950",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: `Must be less than or equal to ${new Date().getFullYear()}`,
                      },
                    }}
                    errors={errors}
                    fgClass="mb-3"
                  />
                </Col>
              </Row>

              <Row className="my-2">
                <Col>
                  <RHFInput
                    control={control}
                    name="lot_num"
                    label="FC Lot Number"
                    inputType="text"
                    required={false}
                    errors={errors}
                    fgClass="mb-3"
                  />
                </Col>

                <Col>
                  <RHFSelect
                    control={control}
                    name="rearing_location_id"
                    label="Rearing Location"
                    required={true}
                    options={rearingLocations}
                    rules={{
                      required: "Rearing Location is required.",
                    }}
                    errors={errors}
                    fgClass="mb-2"
                  />
                </Col>
              </Row>

              <RequiredFieldsMsg />

              <Row className="my-4 justify-content-between">
                <Col md={3}>
                  <Button variant="primary" onClick={handleBackClick}>
                    Back
                  </Button>
                </Col>

                <Col md={3}>
                  <Button className="float-end" variant="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Form>
    </Container>
  );
};
