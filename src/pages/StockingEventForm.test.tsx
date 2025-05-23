import { render, screen, waitFor, fireEvent } from "../test-utils";
import userEvent from "@testing-library/user-event";
import selectEvent, { openMenu, select } from "react-select-event";

import { StockingEventForm } from "./StockingEventForm";

import { dateToString } from "../schemas/test_utils";

// required fields:
//   + lot-identifier
//   + stocking-admin-unit
//   + stocking-purpose
//   + proponent
//   + stocking-date
//   + release-date
//   + transit-methods
//   + destination-waterbody*
//   + stocked-waterbody
//   + stocking-site
//   + number of fish stocked
//   + delvelopment-stage
//   + fin clips

async function selectFirstAsyncOption(selectElement, nameToMatch) {
  await openMenu(selectElement);
  // type a letter:
  fireEvent.change(selectElement, { target: { value: "lake" } });
  // select the first option:
  await select(selectElement, [nameToMatch]);
}

describe("Stocking Lot", () => {
  test("should display error when lot is missing", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "lot_slug-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /lot identifier is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Stocking Admin Unit", () => {
  test("that the stocking admin unit is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_admin_unit_id-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocking admin unit is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo(
    "that the stocking admin unit consistent with our user",
    // if the server returns a message that the user is not assocaited
    // with this admin unit, an error stating that should be displayed.
    // const user = userEvent.setup();
    //render(<StockingEventForm />);
  );
});

describe("Publication Date", () => {
  test("Publication Date is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "publication_date-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  //test("Publication Date cannot be in the past", async () => {
  //  //const user = userEvent.setup();
  //  //render(<StockingEventForm />);
  //});
});

describe("Stocking Purpose", () => {
  test("Stocking Purpose is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_purposes-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /at least one stocking purpose must be selected/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Stocking Proponent", () => {
  test("that proponent is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "proponent_id-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /proponent is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Stocking Date", () => {
  test("that a stocking date is required", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_date-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocking date is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that a stocking date is not in the future", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const d = new Date();
    // one years from now:
    d.setFullYear(d.getFullYear() + 1);

    const future_string = dateToString(d);
    const element = screen.getByLabelText(/stocking date/i);
    await user.type(element, future_string);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_date-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocking date cannot be in the future/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that a stocking date is not too far in the past", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/stocking date/i);

    await user.type(element, "1899-12-31");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_date-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocking dates before 1900 are not allowed/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Release Method", () => {
  test("that a release is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "release_method-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /release method is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Transit Mortality", () => {
  test("transit mortality is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "transit_mortality-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("transit mortality less than zero is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/transit mortality/i);

    await user.type(element, "-10");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "transit_mortality-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /transit mortality must be greater than or equal to 0/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Site Temperature", () => {
  test("site temperature is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "site_temperature-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("site temperature less than the min temp is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/site temperature/i);

    await user.type(element, "-15");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "site_temperature-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /site temperature must be greater than -10/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("site temperature more than the max temp is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/site temperature/i);

    await user.type(element, "45");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "site_temperature-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /site temperature must be less than 30/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

// rearing temperature needs to be added t the form:
//
//describe("Rearing Temperature", () => {
//  test("rearing temperature is optional", async () => {
//    const user = userEvent.setup();
//    render(<StockingEventForm />);
//
//    await user.click(screen.getByRole("button", { name: /submit/i }));
//
//    await waitFor(() => {
//      expect(
//        screen.queryByRole("alert", {
//          name: "rearing_temperature-error",
//        }),
//      ).not.toBeInTheDocument();
//    });
//  });
//
//  test("rearing temperature less than the min temp is invalid", async () => {
//    const user = userEvent.setup();
//    render(<StockingEventForm />);
//
//    const element = screen.getByLabelText(/rearing temperature/i);
//
//    await user.type(element, "-15");
//
//    await user.click(screen.getByRole("button", { name: /submit/i }));
//
//    await waitFor(() => {
//      expect(
//        screen.getByRole("alert", {
//          name: "rearing_temperature-error",
//        }),
//      ).toBeInTheDocument();
//    });
//
//    const errorMsg = /rearing temperature must be greater than -10/i;
//    await waitFor(() => {
//      expect(screen.getByText(errorMsg)).toBeInTheDocument();
//    });
//  });
//
//  test("rearing temperature more than the max temp is invalid", async () => {
//    const user = userEvent.setup();
//    render(<StockingEventForm />);
//
//    const element = screen.getByLabelText(/rearing temperature/i);
//
//    await user.type(element, "45");
//
//    await user.click(screen.getByRole("button", { name: /submit/i }));
//
//    await waitFor(() => {
//      expect(
//        screen.getByRole("alert", {
//          name: "rearing_temperature-error",
//        }),
//      ).toBeInTheDocument();
//    });
//
//    const errorMsg = /rearing temperature must be less than 30/i;
//    await waitFor(() => {
//      expect(screen.getByText(errorMsg)).toBeInTheDocument();
//    });
//  });
//});

describe("Water Depth", () => {
  test("water depth is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "water_depth-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("water depth less than the min depth is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/water depth/i);
    await user.type(element, "0");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "water_depth-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /water depth must be greater than 0/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("water depth more than the max depth is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/water depth/i);
    await user.type(element, "450");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "water_depth-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /water depth must be less than 400/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Transit Method", () => {
  test("that at least one transit method is selected", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "transit_methods-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /at least one transit method must be selected/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Fin Clip", () => {
  test("that at least one fin clip is selected", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /at least one fin clip must be selected/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that fin clip NONE alone is fine", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkbox = await screen.findByRole("checkbox", {
      name: /no clip/i,
    });

    await userEvent.click(checkbox);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "fin_clips-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("that fin clip 0 cannot be selected with any other value", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkbox0 = await screen.findByRole("checkbox", {
      name: /no clip/i,
    });

    await userEvent.click(checkbox0);

    // select and click on adipose too:
    const checkbox5 = await screen.findByRole("checkbox", {
      name: /adipose/i,
    });

    await userEvent.click(checkbox5);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /none cannot be selected with any other fin clip/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that fin clip 12 is not allowed.", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkboxA = await screen.findByRole("checkbox", {
      name: /rpect/i,
    });

    await userEvent.click(checkboxA);
    // select and click on adipose too:
    const checkboxB = await screen.findByRole("checkbox", {
      name: /lpect/i,
    });

    await userEvent.click(checkboxB);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip rpect and lpect cannot be selected together/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that fin clip 13 is not allowed.", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkboxA = await screen.findByRole("checkbox", {
      name: /rpect/i,
    });

    await userEvent.click(checkboxA);

    // select and click on adipose too:
    const checkboxB = await screen.findByRole("checkbox", {
      name: /rvent/i,
    });

    await userEvent.click(checkboxB);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip rpect and rvent cannot be selected together/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that fin clip 24 is not allowed.", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkboxA = await screen.findByRole("checkbox", {
      name: /lpect/i,
    });

    await userEvent.click(checkboxA);

    // select and click on adipose too:
    const checkboxB = await screen.findByRole("checkbox", {
      name: /lvent/i,
    });

    await userEvent.click(checkboxB);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip lpect and lvent cannot be selected together/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
  test("that fin clip 34 is not allowed.", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const checkboxA = await screen.findByRole("checkbox", {
      name: /lvent/i,
    });

    await userEvent.click(checkboxA);

    // select and click on adipose too:
    const checkboxB = await screen.findByRole("checkbox", {
      name: /rvent/i,
    });

    await userEvent.click(checkboxB);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip rvent and lvent cannot be selected/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Destination Waterbody", () => {
  test.todo("that destination watebody is optional");
  // becomes stocked waterbody if it is null.
  // const user = userEvent.setup();
  //render(<StockingEventForm />);
});

describe("Stocked Waterbody", () => {
  test("that stocked watebody is required", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocked_waterbody-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocked waterbody is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Stocking Site", () => {
  test("that stocking site is required", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_site-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /stocking site is a required field/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  //test("that stocking site is consistent with stocked watebody", async () => {
  //  // becomes stocking site if it is null.
  //  // const user = userEvent.setup();
  //  //render(<StockingEventForm />);
  //});
});

describe("Latitude and Longitude", () => {
  test("that dd_lat and dd_lon are optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "latitude_decimal_degrees-error",
        }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "longitude_decimal_degrees-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("that dd_lat is less than min latitude", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/latitude/i, { selector: "input" });

    await user.type(element, "40.0");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "latitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /latiude must be greater than \d{2}\.\d+ degrees/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that dd_lat is more than max latitude", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/latitude/i, { selector: "input" });

    await user.type(element, "56.0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "latitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /latitude must be less than \d{2}\.\d+ degrees/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that dd_lon is less than min longitude", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/longitude/i, { selector: "input" });

    await user.type(element, "-96.0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "longitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /longitude must be greater than -\d{2}\.\d+ degrees/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that dd_lon is more than max longitude", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/longitude/i, { selector: "input" });

    await user.type(element, "-70.0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "longitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /longitude must be less than -\d{2}\.\d+ degrees/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo(
    "that dd_lat and dd_lon are consistent with stocked watebody",
    // becomes stocking site if it is null.
    // const user = userEvent.setup();
    //render(<StockingEventForm />);
  );
});

describe("Number of Fish Stocked", () => {
  test("that the number of fish stocked is required", async () => {
    // const user = userEvent.setup();
    //render(<StockingEventForm />);

    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_stocked_count-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /number of fish stocked is required and must be positive/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("that the number of fish stocked must be positive", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/number of fish stocked/i);
    await user.type(element, "0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_stocked_count-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /number of fish stocked is required and must be positive/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

describe("Fish Weight", () => {
  test("fish weight is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "fish_weight-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("fish weight less than the min is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/fish weight/i);

    await user.type(element, "0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_weight-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /fish weight must be greater than 0/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("fish weight more than the max is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/fish weight/i);

    await user.type(element, "20001");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_weight-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /fish weight must be less than 20000/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

//});
//
describe("Fish Age", () => {
  test("fish age is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "fish_age-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("fish age less than the min is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/fish age/i);
    await user.type(element, "-1");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_age-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /fish age must be greater than or equal to 0/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("fish age more than the max is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/fish age/i);
    await user.type(element, "181");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_age-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /fish age must be less than 180/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});
//
describe("Development Stage", () => {
  test("that development stage is required", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));
    const errorMsg = /development stage is a required field/i;
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "development_stage_id-error",
        }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo("that development stage is consistent with fish age");
});

describe("Clip Retention", () => {
  test("clip retention is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "clip_retention_pct-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("clip retention less than or equal to 0 is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/clip retention/i);
    await user.type(element, "0");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "clip_retention_pct-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip retention rate must be greater than 0/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test("clip retention more than 100 is invalid", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    const element = screen.getByLabelText(/clip retention/i);
    await user.type(element, "101");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "clip_retention_pct-error",
        }),
      ).toBeInTheDocument();
    });

    const errorMsg = /clip retention rate cannot exceed 100/i;
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

//describe("Marks", () => {
//  test("that additional marks is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("mark checks are disabled by defautl", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
//describe("tags", () => {
//  test("that tagging information is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that more than one tag is allowed", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that tag type, placement, orgin and colour are required", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that series start is required, series end is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that tag retention is  optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that tag retention must be an integer between 1 and 100", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that tag ret sam size is optional and must be an integer larger than 0", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that tag ret pop size is optional and must be gte sam size", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that user can add and remove tagging event records", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
describe("Comments", () => {
  test("that inventory comments is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "inventory_comments-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("that marking comments is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "marking_comments-error",
        }),
      ).not.toBeInTheDocument();
    });
  });

  test("that stocking comments is optional", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "stocking_comments-error",
        }),
      ).not.toBeInTheDocument();
    });
  });
});
//

describe("Superrefine validations", () => {
  // the superrefine validation methods are used to validate fields
  // against other fields - these are only run after all of the
  // individual validations pass, which means that we need to populate
  // all of our required fields before we submit the form.  This is a
  // very time consuming process. All super-refine validations are
  // rolled up in this test, including:
  //
  // + lat is required if long is provided
  // + lon is required if lat is provided
  // + publication date cannot occur before stocking date

  test("superrefine validation works as expected", async () => {
    const user = userEvent.setup();
    render(<StockingEventForm />);

    // in order to trigger zodSuperRefine() validation, all of the
    // other validation must pass first.  That mean we have to
    // populate all of the required fields with good data:

    // regular selects. Pick the first:
    //   + lot-identifier
    //   + stocking-admin-unit
    //   + proponent
    //   + delvelopment-stage

    // checkboxes
    //   + stocking-purpose
    //   + fin clips
    //   + transit-methods

    const transit = await screen.findByRole("checkbox", {
      name: /truck/i,
    });

    await userEvent.click(transit);

    const purpose = await screen.findByRole("checkbox", {
      name: /assessment/i,
    });

    await userEvent.click(purpose);

    const finclip = await screen.findByRole("checkbox", {
      name: /no clip/i,
    });

    await userEvent.click(finclip);

    // regular inputs:
    //   + stocking-date
    //   + number of fish stocked

    const stockingDate = screen.getByLabelText(/stocking date/i, {
      selector: "input",
    });

    await user.type(stockingDate, "2025-04-12");

    const numberStocked = screen.getByLabelText(/fish stocked/i, {
      selector: "input",
    });

    await user.type(numberStocked, "12");

    const lotsElement = screen.getByLabelText(/lot identifier/i);

    await selectEvent.select(lotsElement, [/240-2024-334-lm-bjfsc/i]);

    const adminUnitsElement = screen.getByLabelText(/stocking admin unit/i);

    await selectEvent.select(adminUnitsElement, [/1/]);

    const proponentsElement = screen.getByLabelText(/proponent/i, {
      selector: "input",
    });

    await selectEvent.select(proponentsElement, [/bjfcs/i]);

    const devStagesElement = screen.getByLabelText(/development stage/i, {
      selector: "input",
    });

    await selectEvent.select(devStagesElement, [/fingerling/i]);

    const releaseMethodsElement = screen.getByLabelText(/release method/i, {
      selector: "input",
    });

    await selectEvent.select(releaseMethodsElement, [/surface/i]);

    // react-select - select the first
    //   + destination-waterbody
    //   + stocked-waterbody
    //   + stocking-site

    const destWaterbody = screen.getByLabelText(/destination waterbody/i);

    await selectFirstAsyncOption(destWaterbody, /wreck lake/i);

    const stockedWaterbody = screen.getByLabelText(/stocked waterbody/i);

    await selectFirstAsyncOption(stockedWaterbody, /wreck lake/i);

    const stockingSite = screen.getByLabelText(/stocking site/i);

    await selectFirstAsyncOption(stockingSite, /snowfall lake/i);

    const longitudeElement = screen.getByLabelText(/longitude/i, {
      selector: "input",
    });

    await user.type(longitudeElement, "-81.5");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "latitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const latitudeErrorMsg = /latitude is required if longitude is provided/i;
    await waitFor(() => {
      expect(screen.getByText(latitudeErrorMsg)).toBeInTheDocument();
    });

    // clear out longitude and enter a lat and resubmit - we should
    // get at longitude is requred error message:

    await user.clear(longitudeElement);

    const latitudeElement = screen.getByLabelText(/latitude/i, {
      selector: "input",
    });

    await user.type(latitudeElement, "45.5");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("alert", {
          name: "latitude_decimal_degrees-error",
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("alert", {
          name: "longitude_decimal_degrees-error",
        }),
      ).toBeInTheDocument();
    });

    const longitudeErrorMsg = /longitude is required if latitude is provided/i;
    await waitFor(() => {
      expect(screen.getByText(longitudeErrorMsg)).toBeInTheDocument();
    });

    // clear out latitude and add a publication date that occurs
    // before our stocking date and re-submit
    await user.clear(latitudeElement);

    const publicationDate = screen.getByLabelText(/publication date/i, {
      selector: "input",
    });

    // stocking date is 2025-04-10
    await user.type(publicationDate, "2025-04-10");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "publication_date-error",
        }),
      ).toBeInTheDocument();
    });

    const publicationDateErrorMsg =
      /publication date cannot occur before stocking event date/i;
    await waitFor(() => {
      expect(screen.getByText(publicationDateErrorMsg)).toBeInTheDocument();
    });

    expect(screen.queryByText(longitudeErrorMsg)).not.toBeInTheDocument();
    expect(screen.queryByText(latitudeErrorMsg)).not.toBeInTheDocument();
  }, 60000); // <- timeout, this is a very long running test!
});
