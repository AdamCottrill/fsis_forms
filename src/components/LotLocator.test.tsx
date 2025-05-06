import React, { useState } from "react";

import { render, screen } from "../test-utils";

import { LotLocator } from "./LotLocator";

// the LotLocator component needs to be wrapped in our mock query provider
// it also needs to be provided with a state and setstate function.

const Wrapper = () => {
  const [selectedLot, setSelectedLot] = useState("");

  return (
    <LotLocator selectedLot={selectedLot} setSelectedLot={setSelectedLot} />
  );
};

it("should disable strain input when species is null", async () => {
  //  render(<Wrapper />);
  //
  //  const strain = await screen.getByLabelText("select-species_strain_id");
  //  expect(strain).toBeInTheDocument();
  //
  //  screen.debug();
  //
  //  const species = await screen.getBy("select-spc");
  //  expect(species).toBeInTheDocument();
  //
  // expect select-strain to be disabled on load
  // users selects a species
  // expect select-strain to be enabled
  // users clears selected species
  // expect select-strain to be disabled again
});

it("should should reset all filters if reset is clicked", async () => {});

it("should limit other choices and lots when species is selected", async () => {});

it("should limit other choices and lots when strain is selected", async () => {});

it("should limit other choices and lots when yearclass is selected", async () => {});

it("should limit other choices and lots when rearing_location is selected", async () => {});
