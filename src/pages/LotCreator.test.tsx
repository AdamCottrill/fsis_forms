import { render, screen, fireEvent, waitFor } from "../test-utils";

import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import { LotCreator } from "./LotCreator";

import { server } from "../mocks/server";
import { apiUrl } from "../mocks/handlers";

import { HttpResponse, http } from "msw";

// the LotCreator component needs to be wrapped in our mock query provider
// it also needs to be provided with a state and setstate function.

// before each test, select the first element of the dropdown an set
// spawn_year to last year:

//
test.todo(
  "create a new slug if the the form is successfully submitted",
  async () => {},
);

test.todo(
  "it should re-direct to the previous page if the back button is clicked",
  async () => {},
);

test("should contain the expected input elements", async () => {
  render(<LotCreator />);

  // required input elements (with star):
  expect(
    screen.getByLabelText(/species/i, { selector: "input" }),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/strain/i, { selector: "input" }),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/spawn year/i, { selector: "input" }),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("FC Lot Number")).toBeInTheDocument();

  const required_field_msg = screen.getByRole("note");
  expect(required_field_msg).toBeInTheDocument();
  expect(required_field_msg).toHaveTextContent(
    "Required fields are indicated by:",
  );
});

test("should disable strain input when species is null", async () => {
  render(<LotCreator />);

  const species_input = screen.getByLabelText(/species/i, {
    selector: "input",
  });
  let strain_input = screen.getByLabelText(/strain/i, { selector: "input" });

  expect(strain_input).toBeDisabled();

  // users selects a species
  await selectEvent.select(species_input, [/076/]);
  // expect select-strain to be enabled
  await waitFor(() => {
    expect(
      screen.getByLabelText(/strain/i, { selector: "input" }),
    ).not.toBeDisabled();
  });
  // clear selected species:
  //await selectEvent.clearFirst(species_input);
  await selectEvent.clearAll(species_input);
  // expect select-strain to be disabled again
  await waitFor(() => {
    expect(
      screen.getByLabelText(/strain/i, { selector: "input" }),
    ).toBeDisabled();
  });
});

test("should display error when lot number is invalid", async () => {
  // this test will fail unti our client side validation is implemented.
  const user = userEvent.setup();

  render(<LotCreator />);

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, new Date().getFullYear() + "");

  await user.type(
    screen.getByRole("textbox", { name: /lot number/i }),
    "10-4*",
  );

  await user.click(screen.getByRole("button", { name: /submit/i }));

  const errorMsg =
    /lot number must start with 3 digits followed by an optional letter/i;

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "lot_num-error",
      }),
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});

test("should display error when spawn_year is too small", async () => {
  // maximum brood stock age is 14:
  const earliest = new Date().getFullYear() - 14;
  const errorMsg = `Spawn Year must be greater than or equal to ${earliest}`;

  const user = userEvent.setup();

  render(<LotCreator />);

  // make sure our error message isn't in the document now:
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  let element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, "24");

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  // an error should be displayed
  const errorEl = await screen.findByText(errorMsg);
  expect(errorEl).toBeInTheDocument();
});

test("should display error when spawn_year occurs in the future", async () => {
  const user = userEvent.setup();

  render(<LotCreator />);

  const errorMsg = /spawn year cannot be in the future/i;

  // make sure our error message isn't in the document now:
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  const nextYear = new Date().getFullYear() + 1;
  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, nextYear + "");

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "spawn_year-error",
      }),
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});

test("should display error when spawn_year is missing", async () => {
  render(<LotCreator />);

  // make sure our error message isn't in the document before we start:
  expect(
    screen.queryByRole("alert", {
      name: "spawn_year-error",
    }),
  ).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "spawn_year-error",
      }),
    ).toBeInTheDocument();
  });

  const errMsg = /spawn year is required and must be a number between/i;
  await waitFor(() => {
    expect(screen.getByText(errMsg)).toBeInTheDocument();
  });
});

test("should display error when species is missing", async () => {
  const user = userEvent.setup();
  render(<LotCreator />);

  // make sure our error message isn't in the document before we start:
  expect(
    screen.queryByRole("alert", {
      name: "spc-error",
    }),
  ).not.toBeInTheDocument();

  // select the first element in each select widget:
  //await selectEvent.select(screen.getByLabelText(/strain/i, {selector: "input"}), [/UNKN/]);
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  const today = new Date();
  const thisYear = today.getFullYear() + "";
  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, thisYear);

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "spc-error",
      }),
    ).toBeInTheDocument();
  });
});

test("should display error when strain is missing", async () => {
  const user = userEvent.setup();

  render(<LotCreator />);

  // make sure our error message isn't in the document before we start:
  expect(
    screen.queryByRole("alert", {
      name: "species_strain_id-error",
    }),
  ).not.toBeInTheDocument();

  // select the first element in each select widget:

  const species_input = screen.getByLabelText(/species/i, {
    selector: "input",
  });
  await selectEvent.select(species_input, [/076/]);

  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  const today = new Date();
  const thisYear = today.getFullYear() + "";
  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, thisYear);

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "species_strain_id-error",
      }),
    ).toBeInTheDocument();
  });
});

test("should display error when rearing location is missing", async () => {
  const user = userEvent.setup();

  render(<LotCreator />);

  // make sure our error message isn't in the document before we start:
  expect(
    screen.queryByRole("alert", {
      name: "rearing_location_id-error",
    }),
  ).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );

  const today = new Date();
  const thisYear = today.getFullYear() + "";
  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, thisYear);

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("alert", {
        name: "rearing_location_id-error",
      }),
    ).toBeInTheDocument();
  });
});

test("should display an error the server responds with an error", async () => {
  // we need to mock out our server response - currently it always
  // returns a 201 - object created. In this case we want it to tell
  // us that a lot with those criteria already exists and verify
  // that our application displays the message appropriate.

  server.use(
    http.post(`${apiUrl}/lot/create/`, () => {
      return HttpResponse.json(
        {
          non_field_errors: "something went wrong",
        },
        { status: 400 },
      );
    }),
  );

  const user = userEvent.setup();

  render(<LotCreator />);

  // make sure our error message isn't in the document before we start:
  expect(
    screen.queryByRole("alert", {
      name: "server-error",
    }),
  ).not.toBeInTheDocument();

  // select the first element in each select widget:
  await selectEvent.select(
    screen.getByLabelText(/species/i, {
      selector: "input",
    }),
    [/076/],
  );
  await selectEvent.select(
    screen.getByLabelText(/strain/i, { selector: "input" }),
    [/UNKN/],
  );
  await selectEvent.select(
    screen.getByLabelText(/rearing location/i, { selector: "input" }),
    [/BJFSC/],
  );

  const today = new Date();
  const thisYear = today.getFullYear() + "";
  const element = screen.getByLabelText(/spawn year/i, { selector: "input" });
  await user.type(element, thisYear);

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() =>
    expect(
      screen.getByRole("alert", {
        name: "server-error",
      }),
    ).toBeInTheDocument(),
  );

  await waitFor(() =>
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
  );
});
