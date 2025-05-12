import { ZodError } from "zod";

import { AppliedTagInputs } from "../types/types";

import { AppliedTagSchema } from "./AppliedTagSchema";

import { pluck_first_issue } from "./test_utils";

const good_data: AppliedTagInputs = {
  series_start: "630157",
  series_end: "630157",
  tag_type_id: 1,
  tag_colour_id: 2,
  tag_placement_id: 3,
  tag_origin_id: 4,
  retention_rate_pct: 75.5,
  retention_rate_sample_size: 200,
  retention_rate_pop_size: 20000,
};

test("good data should not throw an error", () => {
  const data = AppliedTagSchema.parse(good_data);
  expect(data).toEqual(good_data);
});

test("missing series start should throw an error", () => {
  const data_in = { ...good_data, series_start: undefined };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/series start is a required field/i);
});

test("missing tag type should throw an error", () => {
  const data_in = { ...good_data, tag_type_id: undefined };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/tag type is a required field/i);
});

test("missing tag colour should throw an error", () => {
  const data_in = { ...good_data, tag_colour_id: undefined };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/tag colour is a required field/i);
});

test("missing tag placement should throw an error", () => {
  const data_in = { ...good_data, tag_placement_id: undefined };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/tag placement is a required field/i);
});

test("missing tag origin should throw an error", () => {
  const data_in = { ...good_data, tag_origin_id: undefined };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/tag origin is a required field/i);
});

test("retention rate cannot be less than 0", () => {
  const data_in = { ...good_data, retention_rate_pct: -0.1 };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(
    /retention rate must be greater than or equal to 0/i,
  );
});

test("retention rate cannot be more than 100", () => {
  const data_in = { ...good_data, retention_rate_pct: 100.1 };
  expect(() => AppliedTagSchema.parse(data_in)).toThrow(ZodError);

  const issue = pluck_first_issue(AppliedTagSchema, data_in);
  expect(issue.message).toMatch(/retention rate must be less than 100/i);
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
