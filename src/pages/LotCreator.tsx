// return an empty page that will have form with just lot related elements:
import React, { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { CreateLotFormInputs } from "../types/types";

import usePostLot from "../hooks/usePostLot";
import { RHFInput } from "../components/RHFInput";
import { RHFSelect } from "../components/RHFSelect";

import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";
import { useSpecies } from "../hooks/useSpecies";
import { useStrains } from "../hooks/useStrains";
import { useProponents } from "../hooks/useProponents";
import { useRearingLocations } from "../hooks/useRearingLocations";

export const LotCreator = () => {
  const queryClient = useQueryClient();

  const [newSlug, setNewSlug] = useState("");

  const addLot = usePostLot();

  const default_values = {};

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateLotFormInputs>(default_values);

  const [selectedSpecies, selectedProponent] = watch(["spc", "proponent_slug"]);

  const species = useSpecies();
  const strains = useStrains(selectedSpecies);
  const proponents = useProponents();
  const rearingLocations = useRearingLocations(selectedProponent);

  //TO DO - create as a lookup in backend with api:
  const fundingTypeChoices = [
    { value: "private", label: "Private" },
    { value: "cfip", label: "CFIP" },
    { value: "mnr", label: "MNR" },
    { value: "unkn", label: "Unknown" },
  ];

  const onSubmit = (values: CreateLotFormInputs) => {
    console.log("Values:::", values);
    //TODO: add {onSuccess: (data) => history.push(<somewhere>)}
    addLot.mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        setNewSlug(data.slug);
        // add data.slug to context and return to main page. Use value
        // in context to populate the form.
        // SuccessToast();
        //window.location.href = "../";
      },
    });
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
        <Row className="justify-content-center">
          <Card className="my-4 px-0">
            <Card.Header as="h1">
              <div className="h2">Lot Creator</div>
            </Card.Header>

            {addLot.isError && (
              <Alert variant="danger">
                <Alert.Heading>Server Response:</Alert.Heading>
                <span>Error: {addLot.error.message}</span>
              </Alert>
            )}

            {addLot.isPending && (
              <Alert variant="info">
                <Alert.Heading>Request Pending:</Alert.Heading>
                <span>Inserting the new Lot.</span>
              </Alert>
            )}

            {addLot.isSuccess && newSlug && (
              <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <span>The new Lot ({newSlug}) has been created.</span>
              </Alert>
            )}

            <Card.Body>
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
                  <RHFSelect
                    control={control}
                    name="proponent_slug"
                    label="Proponent"
                    required={true}
                    options={proponents}
                    rules={{
                      required: "Proponent is required.",
                    }}
                    errors={errors}
                    fgClass="mb-2"
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
                    isDisabled={!!!selectedProponent}
                    errors={errors}
                    fgClass="mb-2"
                  />
                </Col>
                <Col>
                  <RHFSelect
                    control={control}
                    name="funding_type"
                    label="Funding Type"
                    required={true}
                    options={fundingTypeChoices}
                    rules={{
                      required: "Funding Type is required.",
                    }}
                    errors={errors}
                    fgClass="mb-2"
                  />
                </Col>
              </Row>

              <RequiredFieldsMsg />

              <Row className="my-4 justify-content-end">
                <Col md={1}>
                  <Button variant="primary" type="submit">
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
