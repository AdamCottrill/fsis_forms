import React from "react";

import { render, screen, fireEvent } from "../test-utils";
import { within, logRoles } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import { LotCreator } from "./LotCreator";

// the LotCreator component needs to be wrapped in our mock query provider
// it also needs to be provided with a state and setstate function.

// before each test, select the first element of the dropdown an set
// spawn_year to last year:

it("should contain the expected input elements", async () => {
  render(<LotCreator />);

  // required input elements (with star):
  expect(screen.getByLabelText("Species*")).toBeInTheDocument();
  expect(screen.getByLabelText("Strain*")).toBeInTheDocument();
  expect(screen.getByLabelText("Spawn Year*")).toBeInTheDocument();
  expect(screen.getByLabelText("Rearing Location*")).toBeInTheDocument();
  expect(screen.getByLabelText("FC Lot Number")).toBeInTheDocument();

  const required_field_msg = screen.getByRole("note");
  expect(required_field_msg).toBeInTheDocument();
  expect(required_field_msg).toHaveTextContent(
    "Required fields are indicated by:",
  );
});

it("should disable strain input when species is null", async () => {
  render(<LotCreator />);

  expect(await screen.findByLabelText("Strain*")).toBeDisabled();
  // users selects a species
  await selectEvent.select(screen.getByLabelText("Species*"), [/076/]);
  // expect select-strain to be enabled
  expect(await screen.findByLabelText("Strain*")).not.toBeDisabled();
  // clear selected species:
  await selectEvent.clearFirst(screen.getByLabelText("Species*"));
  // expect select-strain to be disabled again
  expect(await screen.findByLabelText("Strain*")).toBeDisabled();
});

it.skip("should display error when lot number is invalid", async () => {
  const user = userEvent.setup();

  render(<LotCreator />);

  user.type(screen.getByRole("textbox", { name: /lot number/i }), "10-4*");

  // select the first element in each select widget:
  await selectEvent.select(screen.getByLabelText("Species*"), [/076/]);
  await selectEvent.select(screen.getByLabelText("Strain*", [/UNKN/]));
  const element = screen.getByLabelText("Spawn Year*");
  userEvent.type(element, new Date().getFullYear());

  await selectEvent.select(screen.getByLabelText("Rearing Location*"), [
    /BJFSC/,
  ]);

  user.type(
    screen.getByLabelText("Spawn Year*"),
    new Date().getFullYear() + "",
  );

  user.click(screen.getByRole("button", { name: /submit/i }));

  const errorMsg =
    "Lot Number can only contain letters or numbers and " +
    "must be between 3 and 10 characters long.";

  const errorEl = await screen.getByTestId("lot-number-error");

  expect(errorEl).toBeInTheDocument();
});

it("should display error when spawn_year is too small", async () => {
  const errorMsg = "Must be greater than 1950";

  const user = userEvent.setup();

  render(<LotCreator />);

  // make sure our error message isn't in the document now:
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(screen.getByLabelText("Species*"), [/076/]);
  await selectEvent.select(screen.getByLabelText("Strain*"), [/UNKN/]);
  await selectEvent.select(screen.getByLabelText("Rearing Location*"), [
    /BJFSC/,
  ]);

  const element = screen.getByLabelText("Spawn Year*");
  user.type(element, "24");

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  logRoles("input");

  await expect(element).toBeInvalid();

  // an error should be displayed
  //const errorEl = await screen.findByText(errorMsg);
  //expect(errorEl).toBeInTheDocument();

  const errorEl = await screen.findByTestId("spawn_year-error");

  expect(errorEl).toBeInTheDocument();
});

it("should display error when spawn_year is too big", async () => {
  const user = userEvent.setup();

  render(<LotCreator />);

  const today = new Date();

  const errorMsg = `Must be less than or equal to ${today.getFullYear()}`;

  // make sure our error message isn't in the document now:
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(screen.getByLabelText("Species*"), [/076/]);
  await selectEvent.select(screen.getByLabelText("Strain*"), [/UNKN/]);
  await selectEvent.select(screen.getByLabelText("Rearing Location*"), [
    /BJFSC/,
  ]);

  const nextYear = today.getFullYear() + 1;
  const element = screen.getByLabelText("Spawn Year*");
  user.type(element, nextYear + "");

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  // an error should be displayed

  //const alert = await screen.findByTestId("spawn_year-error");

  //const errorE1 = within(alert).getByText(errorMsg);
  const errrorE1 = await screen.getByText(errorMsg);
  expect(errorEl).toBeInTheDocument();
});

it("should display error when spawn_year is missing", async () => {
  render(<LotCreator />);

  const errorMsg = "Spawn Year is required.";

  // make sure our error message isn't in the document now:
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(screen.getByLabelText("Species*"), [/076/]);
  await selectEvent.select(screen.getByLabelText("Strain*"), [/UNKN/]);
  await selectEvent.select(screen.getByLabelText("Rearing Location*"), [
    /BJFSC/,
  ]);

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  // an error should be displayed
  const errorEl = await screen.findByTestId("spawn_year-error");
  expect(errorEl).toBeInTheDocument();
});

it.todo("should display error when species is missing", async () => {});

it.todo("should display error when strain is missing", async () => {});

it.todo(
  "should display error when rearing location is missing",
  async () => {},
);

it.todo(
  "should display an error the server responds with an error",
  async () => {},
);
