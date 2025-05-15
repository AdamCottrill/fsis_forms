import React from "react";

import { render, screen, waitFor } from "../test-utils";
import userEvent from "@testing-library/user-event";

import { StockingEventForm } from "./StockingEventForm";

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
//    const user = userEvent.setup();
//

describe("Stocking Lot", () => {
  test("should display error when lot is missing", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = /lot identifier is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "lot_slug-error",
        }),
      ).toBeInTheDocument();
    });

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

    const errorMsg = /stocking admin unit is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_admin_unit_id-error",
        }),
      ).toBeInTheDocument();
    });

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

//describe("Publication Date", () => {
//  test("Publication Date is optional", async () => {
//    //const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("Publication Date cannot be in the past", async () => {
//    //const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("Publication Date cannot be more than X years in the future", async () => {
//    //const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//

describe("Stocking Purpose", () => {
  test("Stocking Purpose is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = /at least one stocking purpose must be selected/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_purposes-error",
        }),
      ).toBeInTheDocument();
    });

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

    const errorMsg = /proponent is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "proponent_id-error",
        }),
      ).toBeInTheDocument();
    });

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

    const errorMsg = /stocking date is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_date-error",
        }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo(
    "that a stocking date is not in the future",
    // const user = userEvent.setup();
    //render(<StockingEventForm />);
  );

  test.todo("that a stocking date is not too far in the past");
  // this will be relaxed in the admin.
  // const user = userEvent.setup();
  //render(<StockingEventForm />);
});

describe("Release Method", () => {
  test("that a release is a required field", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = /release method is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "release_method-error",
        }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});

//describe("Transit Mortality", () => {
//  test("transit mortality is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("transit mortality less than zero is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
//describe("Site Temperature", () => {
//  test("site temperature is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("site temperature less than the min temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("site temperature more than the max temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
//describe("Rearing Temperature", () => {
//  test("rearing temperature is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("rearing temperature less than the min temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("rearing temperature more than the max temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
//describe("Water Depth", () => {
//  test("water depth is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("water depth less than the min temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("water depth more than the max temp is invalid", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});

describe("Transit Method", () => {
  test("that at least one transit method is selected", async () => {
    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = /at least one transit method must be selected/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "transit_methods-error",
        }),
      ).toBeInTheDocument();
    });

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

    const errorMsg = /at least one fin clip must be selected/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fin_clips-error",
        }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo("that fin clip 0 cannot be selected with any other value");
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

    const errorMsg = /stocked waterbody is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocked_waterbody-error",
        }),
      ).toBeInTheDocument();
    });

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

    const errorMsg = /stocking site is a required field/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "stocking_site-error",
        }),
      ).toBeInTheDocument();
    });

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

//describe("Latitude and Longitude", () => {
//  test("that dd_lat and dd_lon are optional", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lat is required if dd_lon is provided", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lon is required if dd_lat is provided", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lat is less than max latitude", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lat is more than min latitude", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lon is less than max longitude", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lon is more than min longitude", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that dd_lat and dd_lon are consistent with stocked watebody", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
describe("Number of Fish Stocked", () => {
  test("that the number of fish stocked is required", async () => {
    // const user = userEvent.setup();
    //render(<StockingEventForm />);

    const user = userEvent.setup();

    render(<StockingEventForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = /number of fish stocked is required and must be positive/i;

    await waitFor(() => {
      expect(
        screen.getByRole("alert", {
          name: "fish_stocked_count-error",
        }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test.todo("that the number of fish stocked must be positive");
});

//describe("Fish Weight", () => {
//  test("that the weight of fish stocked is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that fish_weight is less than it's max", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that weight is more than it's min", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
//describe("Fish Age", () => {
//  test("that the age fish stocked is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that fish_age is less than it's max", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that fish_age is more than it's min", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
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

//describe("Clip Retention", () => {
//  test("that the clip retnetion rate is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that clip_retention is less than it's max", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that clip_retention is more than it's min", async () => {
//    // becomes stocking site if it is null.
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
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
//describe("Comments", () => {
//  test("that inventory comments is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that marking comments is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//
//  test("that stocking comments is optional", async () => {
//    // const user = userEvent.setup();
//    //render(<StockingEventForm />);
//  });
//});
//
