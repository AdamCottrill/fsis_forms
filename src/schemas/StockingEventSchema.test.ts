import { ZodError } from "zod";

import { StockingEventInputs } from "../types/types";

import { StockingEventSchema } from "./StockingEventSchema";

import { pluck_first_issue } from "./test_utils";

const format_date = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, 0);
  const dd = String(date.getDate()).padStart(2, 0);
  return `${yyyy}-${mm}-${dd}`;
};

const good_data: StockingEventInputs = {
  lot_slug: "foo-bar-baz",
  stocking_admin_unit_id: 9,
  publication_date: "2024-05-12",
  stocking_purposes: [1],
  proponent_id: 2,
  release_method_id: 3,
  stocking_date: "2024-05-10",
  transit_mortality: 15,
  site_temperature: 15.4,
  rearing_temperature: 10.5,
  water_depth: 12.6,
  transit_methods: [1, 2, 3],
  destination_waterbody_id: 5,
  stocked_waterbody_id: 6,
  stocking_site_id: 10,
  latitude_decimal_degrees: 45.1,
  longitude_decimal_degrees: -81.2,
  fish_stocked_count: 10000,
  fish_weight: 0.15,
  fish_age: 6,
  development_stage_id: 4,
  fin_clips: ["1", "4"],
  cip_retention_pct: 95.2,
  //tags_applied: ?StockingEvent[],
  inventory_comments: "life was good in the hatchery",
  marking_comments: "that hurt",
  stocking_comments: "where am I?",
};

test("good data should not throw an error", () => {
  const data = StockingEventSchema.parse(good_data);
  expect(data).toEqual(good_data);
});

test("missing lot_num should throw an error", () => {
  const data_in = { ...good_data, lot_slug: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/Lot Identifier is a required field/i);
});

test("missing stocking_admin_id should throw an error", () => {
  const data_in = { ...good_data, stocking_admin_unit_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/stocking admin unit is a required field/i);
});

describe("publication date", () => {
  test("can be empty", () => {
    const data_in = { ...good_data, publication_date: "" };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("can't occur more than a year from now (say)", () => {
    const d = new Date();
    // two years from now:
    d.setYear(d.getFullYear() + 2);

    const future_string = format_date(d);

    const data_in = { ...good_data, publication_date: future_string };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /publication date more than a year in the future is not allowed./i,
    );
  });
  test("can't occur before stocking date", () => {
    const stocking_date = new Date(Date.parse(good_data["stocking_date"]));
    const pub_date = new Date(
      stocking_date.setMonth(stocking_date.getMonth() - 1),
    );

    const yyyy = pub_date.getFullYear();
    const mm = String(pub_date.getMonth() + 1).padStart(2, 0);
    const dd = String(pub_date.getDate()).padStart(2, 0);
    const date_string = `${yyyy}-${mm}-${dd}`;

    const data_in = { ...good_data, publication_date: date_string };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /publication date cannot occur before stocking event date/i,
    );
  });
});

describe("Stocking purpose", () => {
  test("one selection is fine", () => {
    const data_in = { ...good_data, stocking_purposes: [3] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("more than one selection is also good.", () => {
    const data_in = { ...good_data, stocking_purposes: [1, 2, 3] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("missing selection will throw an error", () => {
    const data_in = { ...good_data, stocking_purposes: [] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /at least one stocking purpose must be selected/i,
    );
  });
});

test("missing proponent_id should throw an error", () => {
  const data_in = { ...good_data, proponent_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/proponent is a required field/i);
});

test("missing release method_id should throw an error", () => {
  const data_in = { ...good_data, release_method_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/release method is a required field/i);
});

describe("stocking date", () => {
  test("can't occur in the futureo", () => {
    const stocking_date = new Date();

    stocking_date.setDate(stocking_date.getDate() + 2);

    const date_string = format_date(stocking_date);

    const data_in = {
      ...good_data,
      stocking_date: date_string,
      publication_date: "",
    };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/stocking date cannot be in the future/i);
  });

  test("can't occur too far in the past (more than a year ago)", () => {});

  test("missing stocking event date should throw an error", () => {
    const data_in = { ...good_data, stocking_date: undefined };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/stocking date is a required field/i);
  });
});

describe("Transit Mortality", () => {
  test("null is find", () => {});
  test("negative values will throw an error", () => {});
});

describe("Site Temperatures", () => {
  test("null is find", () => {});
  test("extremely cold values will throw an error", () => {});
  test("extremely hot values will throw an error", () => {});
});

describe("Rearing Temperatures", () => {
  test("null is find", () => {});
  test("extremely cold values will throw an error", () => {});
  test("extremely hot values will throw an error", () => {});
});

describe("Water Depth", () => {
  test("null is find", () => {});
  test("a value of 0 or less will throw an error", () => {});
  test("extremely deep values will throw an error", () => {});
});

describe("Transit Method", () => {
  test("one selection is fine", () => {
    const data_in = { ...good_data, transit_methods: [3] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("more than one selection is also good.", () => {
    const data_in = { ...good_data, transit_methods: [1, 2, 3] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("missing selection will throw an error", () => {
    const data_in = { ...good_data, transit_methods: [] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /at least one transit method must be selected/i,
    );
  });
});

test("missing destination_waterbody_id should throw an error", () => {
  const data_in = { ...good_data, destination_waterbody_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/destination waterbody is a required field/i);
});

test("missing stocked_waterbody_id should throw an error", () => {
  const data_in = { ...good_data, stocked_waterbody_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/stocked waterbody is a required field/i);
});

test("missing stocking_site_id should throw an error", () => {
  const data_in = { ...good_data, stocking_site_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/stocking site is a required field/i);
});

describe("latitude_decimal_degrees", () => {
  test("null is find if lon it null too", () => {});
  test("extremely small values will throw an error", () => {});
  test("extremely large values will throw an error", () => {});
});

describe("longitude_decimal_degrees", () => {
  test("null is find as long as lat is null too", () => {});
  test("extremely small values will throw an error", () => {});
  test("extremely large values will throw an error", () => {});
});

describe("fish_stocked_count", () => {
  test("missing fish_stocked_count should throw an error", () => {
    const data_in = { ...good_data, fish_stocked_count: undefined };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/fish stocked is a required field/i);
  });

  test("a value of 0 or less will throw an error", () => {});
});

describe("fish weight", () => {
  test("null is find", () => {});
  test("values <=0 will throw an error", () => {});
  test("extremely large values will throw an error", () => {});
});

describe("fish age", () => {
  test("null is find", () => {});
  test("values <=0 will throw an error", () => {});
  test("values >180 will throw an error", () => {});
});

test("missing development_stage_id should throw an error", () => {
  const data_in = { ...good_data, development_stage_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/development stage is a required field/i);
});

describe("fin clip", () => {
  test("missing fin_clips should throw an error", () => {
    const data_in = { ...good_data, fin_clips: [] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/at least one fin clip must be selected/i);
  });

  test("one selection is fine", () => {
    const data_in = { ...good_data, fin_clips: ["3"] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("more than one selection is also good.", () => {
    const data_in = { ...good_data, fin_clips: ["2", "3", "5"] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("clip 0 alone is fine", () => {
    const data_in = { ...good_data, fin_clips: ["0"] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("Unknown ('U') alone is fine", () => {});

  test("0 cannot appear with any other clip code", () => {
    const data_in = { ...good_data, fin_clips: ["0", "3"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /0 cannot be selected with any other fin clip/i,
    );
  });

  test("Unknown cannot be selected with any other fin clip", () => {
    const data_in = { ...good_data, fin_clips: ["U", "3"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /unknown cannot be selected with any other fin clip/i,
    );
  });

  test("clip 12 is not allowed", () => {
    const data_in = { ...good_data, fin_clips: ["1", "2"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip 1 and 2 cannot be selected together/i);
  });

  test("clip 13 is not allowed", () => {
    const data_in = { ...good_data, fin_clips: ["1", "3"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip 1 and 3 cannot be selected together/i);
  });

  test("clip 24 is not allowed", () => {
    const data_in = { ...good_data, fin_clips: ["2", "4"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip 2 and 4 cannot be selected together/i);
  });

  test("clip 34 is not allowed", () => {
    const data_in = { ...good_data, fin_clips: ["3", "4"] };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip 3 and 4 cannot be selected together/i);
  });
});

describe("clip_retention_pct", () => {
  test("null is ok.", () => {});
  test("values smaller than 0 will throw an error", () => {});
  test("values larger than 100 will throw an error", () => {});
});

//  //tags_applied: ?StockingEvent[];
//  inventory_comments: z.string().optional(),
//  marking_comments: z.string().optional(),
//  stocking_comments: z.string().optional(),
//});
//
