import { ZodError } from "zod";

import { StockingEventInputs } from "../types/types";

import { StockingEventSchema } from "./StockingEventSchema";

import { pluck_first_issue } from "./test_utils";

const dateToString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const good_data: StockingEventInputs = {
  lot_slug: "foo-bar-baz",
  stocking_admin_unit_id: 9,
  publication_date: "2024-05-12",
  stocking_purposes: ["1"],
  proponent_id: "bjfcs",
  release_method: "surface",
  stocking_date: "2024-05-10",
  transit_mortality: 15,
  site_temperature: 15.4,
  rearing_temperature: 10.5,
  water_depth: 12.6,
  transit_methods: ["1", "2", "3"],
  destination_waterbody: 5,
  stocked_waterbody: 6,
  stocking_site: 10,
  latitude_decimal_degrees: 45.1,
  longitude_decimal_degrees: -81.2,
  fish_stocked_count: 10000,
  fish_weight: 0.15,
  fish_age: 6,
  development_stage_id: "4",
  fin_clips: ["1", "4"],
  clip_retention_pct: 95.2,
  //tags_applied: ?StockingEvent[],
  inventory_comments: "life was good in the hatchery",
  marking_comments: "that hurt",
  stocking_comments: "where am I?",

  oxytetracycline: false,
  brand: false,
  fluorescent_dye: false,
  other_mark: false,
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
    d.setFullYear(d.getFullYear() + 2);

    const future_string = dateToString(d);

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
      stocking_date.setDate(stocking_date.getDate() - 2),
    );

    const date_string = dateToString(pub_date);

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
    const data_in = { ...good_data, stocking_purposes: ["3"] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("more than one selection is also good.", () => {
    const data_in = { ...good_data, stocking_purposes: ["1", "2", "3"] };
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

describe("proponent", () => {
  test("undefined proponent should throw an error", () => {
    const data_in = { ...good_data, proponent_id: undefined };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/proponent is a required field/i);
  });

  test("empty string proponent should throw an error", () => {
    const data_in = { ...good_data, proponent_id: "" };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/proponent is a required field/i);
  });
});

describe("release_method", () => {
  test("undefined release method_id should throw an error", () => {
    const data_in = { ...good_data, release_method: undefined };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/release method is a required field/i);
  });

  test("empty string as release method should throw an error", () => {
    const data_in = { ...good_data, release_method: "" };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/release method is a required field/i);
  });
});

describe("stocking date", () => {
  test("can't occur in the future", () => {
    const stocking_date = new Date();

    stocking_date.setDate(stocking_date.getDate() + 2);

    const date_string = dateToString(stocking_date);

    const data_in = {
      ...good_data,
      stocking_date: date_string,
      publication_date: "",
    };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/stocking date cannot be in the future/i);
  });

  test("can't occur too far in the past", () => {
    const data_in = {
      ...good_data,
      stocking_date: "1899-12-30",
      publication_date: "",
    };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /stocking dates before 1900 are not allowed/i,
    );
  });

  test("missing stocking event date should throw an error", () => {
    const data_in = { ...good_data, stocking_date: undefined };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/stocking date is a required field/i);
  });

  test("empty string for event date should throw an error", () => {
    const data_in = { ...good_data, stocking_date: "" };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/stocking date is a required field/i);
  });
});

describe("Transit Mortality", () => {
  test("null is fine", () => {
    const data_in = { ...good_data, transit_mortality: undefined };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("zero is fine too", () => {
    const data_in = { ...good_data, transit_mortality: 0 };
    const data_out = StockingEventSchema.parse(data_in);

    expect(data_out).toEqual(data_in);
  });

  test("negative values will throw an error", () => {
    const data_in = { ...good_data, transit_mortality: -10 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /transit mortality must be greater than or equal to 0/i,
    );
  });
});

describe("Site Temperatures", () => {
  test("null is fine", () => {
    const data_in = { ...good_data, site_temperature: undefined };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("extremely cold values will throw an error", () => {
    const data_in = { ...good_data, site_temperature: -11 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/site temperature must be greater than -10/i);
  });
  test("extremely hot values will throw an error", () => {
    const data_in = { ...good_data, site_temperature: 31 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/site temperature must be less than 30/i);
  });
});

describe("Rearing Temperatures", () => {
  test("null is fine", () => {
    const data_in = { ...good_data, rearing_temperature: undefined };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("extremely cold values will throw an error", () => {
    const data_in = { ...good_data, rearing_temperature: -11 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /rearing temperature must be greater than -10/i,
    );
  });
  test("extremely hot values will throw an error", () => {
    const data_in = { ...good_data, rearing_temperature: 31 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/rearing temperature must be less than 30/i);
  });
});

describe("Water Depth", () => {
  test("null is fine", () => {
    const data_in = { ...good_data, water_depth: undefined };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("empty string is fine too", () => {
    const data_in = { ...good_data, water_depth: "" };
    const data_out = StockingEventSchema.parse(data_in);

    //zod will transform "" to undefeined:
    const expected_out = { ...good_data, water_depth: undefined };
    expect(data_out).toEqual(expected_out);
  });

  test("a value of 0 or less will throw an error", () => {
    const data_in = { ...good_data, water_depth: 0 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/water depth must be greater than 0 m/i);
  });
  test("extremely deep values will throw an error", () => {
    const data_in = { ...good_data, water_depth: 401 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/water depth must be less than 400 m/i);
  });
});

describe("Transit Method", () => {
  test("one selection is fine", () => {
    const data_in = { ...good_data, transit_methods: ["3"] };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("more than one selection is also good.", () => {
    const data_in = { ...good_data, transit_methods: ["1", "2", "3"] };
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

test("missing destination_waterbody should throw an error", () => {
  const data_in = { ...good_data, destination_waterbody: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/destination waterbody is a required field/i);
});

test("missing stocked_waterbody should throw an error", () => {
  const data_in = { ...good_data, stocked_waterbody: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/stocked waterbody is a required field/i);
});

test("missing stocking_site should throw an error", () => {
  const data_in = { ...good_data, stocking_site: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/stocking site is a required field/i);
});

describe("latitude_decimal_degrees", () => {
  test("values too far south will throw an error", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 41.6,
      longitude_decimal_degrees: -81.5,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /latiude must be greater than 41.67 degrees/i,
    );
  });
  test("values too far north will throw an error", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 55.9,
      longitude_decimal_degrees: -81.5,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/latitude must be less than 55.86 degrees/i);
  });
});

describe("longitude_decimal_degrees", () => {
  test("values too far east will throw an error", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 45.5,
      longitude_decimal_degrees: -74.2,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /longitude must be less than -74.32 degrees/i,
    );
  });
  test("values too far west will throw an error", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 45.5,
      longitude_decimal_degrees: -95.2,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /longitude must be greater than -95.15 degrees/i,
    );
  });
});

describe("lat and lon together", () => {
  test("lat and lon can both be within their bounds", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 45.5,
      longitude_decimal_degrees: -81.5,
    };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("lat and lon can both be null", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: undefined,
      longitude_decimal_degrees: undefined,
    };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });

  test("longitude is required if latitude is provided", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: 45.5,
      longitude_decimal_degrees: undefined,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /longitude is required if latitude is provided/i,
    );
  });

  test("latitude is required if longitude is provided", () => {
    const data_in = {
      ...good_data,
      latitude_decimal_degrees: undefined,
      longitude_decimal_degrees: -81.5,
    };

    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /latitude is required if longitude is provided/i,
    );
  });
});

describe("fish_stocked_count", () => {
  test("empty string fish_stocked_count should throw an error", () => {
    const data_in = { ...good_data, fish_stocked_count: "" };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /number of fish stocked is required and must be positive/i,
    );
  });

  test("a value of 0 or less will throw an error", () => {
    const data_in = { ...good_data, fish_stocked_count: 0 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(
      /number of fish stocked is required and must be positive/i,
    );
  });
});

describe("fish weight", () => {
  test("empty string is fine", () => {
    const data_in = {
      ...good_data,
      fish_weight: "",
    };
    const data_out = StockingEventSchema.parse(data_in);

    // fish_weight should be transformed by zod:
    const expected_out = { ...data_in, fish_weight: undefined };

    expect(data_out).toEqual(expected_out);
  });
  test("values <=0 will throw an error", () => {
    const data_in = { ...good_data, fish_weight: 0 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/fish weight must be greater than 0 g/i);
  });
  test("extremely large values will throw an error", () => {
    const data_in = { ...good_data, fish_weight: 20001 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);
    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/fish weight must be less than 20000 g/i);
  });
});

describe("fish age", () => {
  test("null is fine", () => {
    const data_in = {
      ...good_data,
      fish_age: undefined,
    };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("values <=0 will throw an error", () => {
    const data_in = { ...good_data, fish_age: 0 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/fish age must be greater than 0/i);
  });
  test("values over 180 will throw an error", () => {
    const data_in = { ...good_data, fish_age: 181 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);
    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/fish age must be less than 180 months/i);
  });
});

test("undefined development_stage should throw an error", () => {
  const data_in = { ...good_data, development_stage_id: undefined };
  expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(StockingEventSchema, data_in);
  expect(issue.message).toMatch(/development stage is a required field/i);
});

test("empty string development_stage should throw an error", () => {
  const data_in = { ...good_data, development_stage_id: "" };
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

  test.todo(
    "Unknown ('U') alone is fine",
    // there is currently no code for 'unnkown' - there probably
    // should be to differentiate it from No clips, I don't know, and
    // I missed this field.
  );

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
  test("null is fine", () => {
    const data_in = {
      ...good_data,
      clip_retention_pct: undefined,
    };
    const data_out = StockingEventSchema.parse(data_in);
    expect(data_out).toEqual(data_in);
  });
  test("values <=0 will throw an error", () => {
    const data_in = { ...good_data, clip_retention_pct: -0.01 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip retention must be greater than 0/i);
  });
  test("values over 100 will throw an error", () => {
    const data_in = { ...good_data, clip_retention_pct: 100.1 };
    expect(() => StockingEventSchema.parse(data_in)).toThrow(ZodError);
    const issue = pluck_first_issue(StockingEventSchema, data_in);
    expect(issue.message).toMatch(/clip retention rate cannot exceed 100%/i);
  });
});

//  //tags_applied: ?StockingEvent[];
//  inventory_comments: z.string().optional(),
//  marking_comments: z.string().optional(),
//  stocking_comments: z.string().optional(),
//});
//
