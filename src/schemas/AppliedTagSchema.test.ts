import { ZodError } from "zod";

import { AppliedTag } from "../types/types";

import { AppliedTagSchema } from "./AppliedTagSchema";

import { pluck_first_issue, pluck_all_issue } from "./test_utils";

const good_data: AppliedTag = {
  series_start: "630157",
  series_end: "630157",
  tag_type: "1",
  tag_colour: "2",
  tag_placement: "3",
  tag_origin: "omnr",
  retention_rate_pct: 75.5,
  retention_rate_sample_size: 200,
  retention_rate_pop_size: 20000,
};

const all_strings: AppliedTag = {
  series_start: "",
  series_end: "",
  tag_type: "",
  tag_colour: "",
  tag_placement: "",
  tag_origin: "",
  retention_rate_pct: "",
  retention_rate_sample_size: "",
  retention_rate_pop_size: "",
};

describe("empty applied tags", () => {
  test("all strings should not throw an error", () => {
    const data = AppliedTagSchema.parse(all_strings);
    expect(data).toEqual(all_strings);
  });

  test("all undefined should not throw an error", () => {
    const all_undefined = {
      series_start: undefined,
      series_end: undefined,
      tag_type: undefined,
      tag_colour: undefined,
      tag_placement: undefined,
      tag_origin: undefined,
      retention_rate_pct: undefined,
      retention_rate_sample_size: undefined,
      retention_rate_pop_size: undefined,
    };

    const data = AppliedTagSchema.parse(all_undefined);
    expect(data).toEqual(all_strings);
  });
});

describe("applied tags with data", () => {
  test("good, complete, data should not throw an error", () => {
    const data = AppliedTagSchema.parse(good_data);
    expect(data).toEqual(good_data);
  });

  test("undefined series start should throw an error", () => {
    const data_in = { ...good_data, series_start: undefined };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/series start is a required field/i);
  });

  test("null series start should throw an error", () => {
    const data_in = { ...good_data, series_start: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/series start is a required field/i);
  });

  test("empty string as series start should throw an error", () => {
    const data_in = { ...good_data, series_start: "" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/series start is a required field/i);
  });

  test("empty string for tag type should throw an error", () => {
    const data_in = { ...good_data, tag_type: "" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag type is a required field/i);
  });

  test("null tag type should throw an error", () => {
    const data_in = { ...good_data, tag_type: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag type is a required field/i);
  });

  test("undefined tag type should throw an error", () => {
    const data_in = { ...good_data, tag_type: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag type is a required field/i);
  });

  test("null tag colour should throw an error", () => {
    const data_in = { ...good_data, tag_colour: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag colour is a required field/i);
  });

  test("undefined tag colour should throw an error", () => {
    const data_in = { ...good_data, tag_colour: undefined };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag colour is a required field/i);
  });

  test("empty string as tag colour should throw an error", () => {
    const data_in = { ...good_data, tag_colour: "" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag colour is a required field/i);
  });

  test("empty string as tag placement should throw an error", () => {
    const data_in = { ...good_data, tag_placement: "" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag placement is a required field/i);
  });

  test("null tag placement should throw an error", () => {
    const data_in = { ...good_data, tag_placement: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag placement is a required field/i);
  });

  test("undefined placement should throw an error", () => {
    const data_in = { ...good_data, tag_placement: undefined };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag placement is a required field/i);
  });

  test("empty string as tag origin should throw an error", () => {
    const data_in = { ...good_data, tag_origin: "" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag origin is a required field/i);
  });

  test("undefined tag origin should throw an error", () => {
    const data_in = { ...good_data, tag_origin: undefined };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag origin is a required field/i);
  });

  test("null tag origin should throw an error", () => {
    const data_in = { ...good_data, tag_origin: null };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag origin is a required field/i);
  });

  test("retention rate cannot be less than 0", () => {
    const data_in = { ...good_data, retention_rate_pct: -0.1 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag retention rate must be greater than 0/i);
  });

  test("retention rate cannot be more than 100", () => {
    const data_in = { ...good_data, retention_rate_pct: 100.1 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/tag retention rate cannot exceed 100/i);
  });

  test("retention rate sam size is number > 0", () => {
    const data_in = { ...good_data, retention_rate_sample_size: 0 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/sample size must be greater than 0/i);
  });

  test("retention rate pop size is number > 0", () => {
    const data_in = { ...good_data, retention_rate_pop_size: 0 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/population size must be greater than 0/i);
  });

  test.fails("population size is less than sam size", () => {
    // currently unable to get this to fail without breaking the
    // validator for good data.
    const data_in = {
      ...good_data,
      retention_rate_sample_size: 200,
      retention_rate_pop_size: 180,
    };

    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(AppliedTagSchema, data_in);
    expect(issue.message).toMatch(/population size must be >= sample size/i);
  });
});

describe("partially populated fields", () => {
  // if any of the fields are populated, then we expect the required
  // fields to be required:

  // series_end
  //retention_rate_pct: 75.5,
  //retention_rate_sample_size: 200,
  //retention_rate_pop_size: 20000,

  const expected_errors = new Set([
    "Series Start is a required field",
    "Tag Colour is a required field",
    "Tag Type is a required field",
    "Tag Placement is a required field",
    "Tag Origin is a required field",
  ]);

  test("series_end alone will trigger required fields", () => {
    const data_in = { ...all_strings, series_end: "1234" };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);
    const all_issues = pluck_all_issue(AppliedTagSchema, data_in);
    expect(new Set(all_issues)).toEqual(expected_errors);
  });

  test("retention_rate_pct alone will trigger required fields", () => {
    const data_in = { ...all_strings, retention_rate_pct: 75.5 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);
    const all_issues = pluck_all_issue(AppliedTagSchema, data_in);
    expect(new Set(all_issues)).toEqual(expected_errors);
  });

  test("retention_rate_sample_size alone will trigger required fields", () => {
    const data_in = { ...all_strings, retention_rate_sample_size: 75 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);
    const all_issues = pluck_all_issue(AppliedTagSchema, data_in);
    expect(new Set(all_issues)).toEqual(expected_errors);
  });

  test("retention_rate_pop_size alone will trigger required fields", () => {
    const data_in = { ...all_strings, retention_rate_pop_size: 75 };
    expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);
    const all_issues = pluck_all_issue(AppliedTagSchema, data_in);
    expect(new Set(all_issues)).toEqual(expected_errors);
  });
});
