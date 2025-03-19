// return an empty page that will have form with just lot related elements:
import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import {
  getSpecies,
  getStrains,
  getProponents,
  getRearingLocations,
} from "../services/api";

import { RHFInput } from "../components/RHFInput";
import { RHFSelect } from "../components/RHFSelect";

import { RequiredFieldsMsg } from "../components/RequiredFieldsMsg";

interface CreateLotFormInputs {
  lot_number: string;
  spc: string;
  strain_id: number;
  proponent_slug: string;
  rearing_location_id: number;
  spawn_year: number;
  funding_type: number;
}

export const LotCreator = () => {
  const default_values = {};

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateLotFormInputs>(default_values);

  const [selectedSpecies, selectedProponent] = watch(["spc", "proponent_slug"]);

  const { data: species } = useQuery({
    queryKey: ["species"],
    queryFn: () => getSpecies(),
  });

  // parametersize by species
  const { data: strains } = useQuery({
    queryKey: ["strains", selectedSpecies],
    queryFn: () => getStrains(selectedSpecies),
    // The query will not execute until the species exists
    enabled: !!selectedSpecies,
  });

  const { data: proponents } = useQuery({
    queryKey: ["proponents"],
    queryFn: () => getProponents(),
  });

  // parametersize by proponent
  const { data: rearingLocations } = useQuery({
    queryKey: ["rearing-locations", selectedProponent],
    queryFn: () => getRearingLocations(selectedProponent),
    enabled: !!selectedProponent,
  });

  const speciesChoices = species
    ? species.map((x) => {
        return {
          value: x.spc,
          label: `${x.spc_nmco} (${x.spc_nmsc}) [${x.spc}]`,
        };
      })
    : [];
  speciesChoices.sort((a, b) => (a.label > b.label ? 1 : -1));

  const strainChoices = strains
    ? strains.map((x) => {
        return {
          value: x.id,
          label: `${x.strain_name} (${x.strain_code})`,
        };
      })
    : [];

  strainChoices.sort((a, b) => (a.label > b.label ? 1 : -1));

  const proponentChoices = proponents
    ? proponents.map((x) => {
        return {
          value: x.slug,
          label: `${x.proponent_name} (${x.proponent_abbrev})`,
        };
      })
    : [];

  proponentChoices.sort((a, b) => (a.label > b.label ? 1 : -1));

  const rearingLocationChoices = rearingLocations
    ? rearingLocations.map((x) => {
        return { value: x.id, label: `${x.name} (${x.abbrev})` };
      })
    : [];

  rearingLocationChoices.sort((a, b) => (a.label > b.label ? 1 : -1));

  //TO DO - create as a lookup in backend with api:
  const fundingTypeChoices = [
    { value: 1, label: "CFHIP" },
    { value: 2, label: "MNR" },
    { value: 3, label: "Private" },
    { value: 4, label: "Other" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
  };

  const onSubmit = (values) => {
    console.log("Values:::", values);
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
            <Card.Body>
              <Row className="my-2">
                <Col>
                  <RHFInput
                    control={control}
                    name="lot_number"
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
                    options={speciesChoices}
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
                    name="strain_id"
                    label="Strain"
                    required={true}
                    options={strainChoices}
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
                    options={proponentChoices}
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
                    options={rearingLocationChoices}
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
