import { ZodError } from "zod";

import { CreateLotFormInputs } from "../types/types";

import { CreateLotSchema } from "./CreateLotSchema";
import { getAllByTestId } from "@testing-library/dom";

const good_data: CreateLotFormInputs = {
  lot_num: "",
  rearing_location_id: 26,
  spawn_year: 2023,
  spc: "083",
  species_strain_id: 93,
};

const pluck_first_issue = (schema, data) => {
  try {
    schema.parse(data);
  } catch (err) {
    return err.issues[0];
  }
};

test("good data should not throw an error", () => {
  const data = CreateLotSchema.parse(good_data);
  expect(data).toEqual(good_data);
});

test("missing spc should throw an error", () => {
  const data_in = { ...good_data, spc: undefined };
  expect(() => CreateLotSchema.parse(data_in)).toThrowError(ZodError);

  const issue = pluck_first_issue(CreateLotSchema, data_in);
  expect(issue.message).toMatch(/species is a required field/i);
});

test("missing strain should throw an error", () => {
  const data_in = { ...good_data, species_strain_id: undefined };
  expect(() => CreateLotSchema.parse(data_in)).toThrowError(ZodError);
  const issue = pluck_first_issue(CreateLotSchema, data_in);
  expect(issue.message).toMatch(/strain is a required field/i);
});
test("missing rearing location should throw an error", () => {
  const data_in = { ...good_data, rearing_location_id: undefined };
  expect(() => CreateLotSchema.parse(data_in)).toThrowError(ZodError);

  const issue = pluck_first_issue(CreateLotSchema, data_in);
  expect(issue.message).toMatch(/rearing location is a required field/i);
});

describe("spawn_year", () => {
  test("missing spawn year should throw an error", () => {
    const data_in = { ...good_data, spawn_year: undefined };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);
    expect(issue.message).toMatch(/spawn year is a required field/i);
  });

  test("small spawn year should throw an error", () => {
    const data_in = { ...good_data, spawn_year: "1949" };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);

    const errmsg = /spawn year must be greater than or equal to /i;

    expect(issue.message).toMatch(errmsg);
  });

  test("large spawn year should throw an error", () => {
    const next_year = new Date().getFullYear() + 1;

    const data_in = { ...good_data, spawn_year: next_year + "" };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);
    expect(issue.message).toMatch(/spawn year cannot be in the future/i);
  });
});

describe("lot_num", () => {
  test("A valid lot number should not throw an error", () => {
    const data_in = { ...good_data, lot_num: "123A" };
    const data = CreateLotSchema.parse(data_in);
    expect(data).toEqual(data_in);
  });

  test("A lowercase letter should automatially converted and not throw an error", () => {
    const data_in = { ...good_data, lot_num: "123a" };
    const data = CreateLotSchema.parse(data_in);
    expect(data).toEqual({ ...good_data, lot_num: "123A" });
  });

  //this one fails currently:
  test("A single space as lot number should not throw an error", () => {
    const data_in = { ...good_data, lot_num: " " };
    const data = CreateLotSchema.parse(data_in);
    expect(data).toEqual({ ...data_in, lot_num: "" });
  });

  test("short lot_num should throw an error", () => {
    const data_in = { ...good_data, lot_num: "12" };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);
    const msg =
      /Lot Number must start with 3 digits followed by an optional letter/;
    expect(issue.message).toMatch(msg);
  });

  test("long lot_num should throw an error", () => {
    const data_in = { ...good_data, lot_num: "1234" };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);
    const msg =
      /Lot Number must start with 3 digits followed by an optional letter/;
    expect(issue.message).toMatch(msg);
  });

  test("invalid lot_num should throw an error", () => {
    const data_in = { ...good_data, lot_num: "ABC" };
    expect(() => CreateLotSchema.parse(data_in)).toThrow(ZodError);

    const issue = pluck_first_issue(CreateLotSchema, data_in);
    const msg =
      /Lot Number must start with 3 digits followed by an optional letter/;
    expect(issue.message).toMatch(msg);
  });
});
