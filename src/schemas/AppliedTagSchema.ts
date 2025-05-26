import { AppliedTag } from "../types/types";
import { z, ZodType } from "zod"; // Add new import

// appliedTagshema is valid if:
// all fields are empty
// if any field had any data, then series_start, tag type, tag colour, tag position and tag origin are required

// is can be accomplished by using a union of an empty schema with a
// tighter schema with those requirements:

const EmptyTagSchema: ZodType<AppliedTag> = z.object({
  series_start: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  series_end: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  tag_type: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  tag_colour: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  tag_placement: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  tag_origin: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  retention_rate_pct: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  retention_rate_sample_size: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
  retention_rate_pop_size: z.preprocess((val) => {
    return val !== undefined ? val : "";
  }, z.literal("")),
});

const FilledTagSchema: ZodType<AppliedTag> = z.object({
  series_start: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z
      .string({
        required_error: "Series Start is a required field",
      })
      .nonempty({ message: "Series Start is a required field" }),
  ),

  series_end: z.string({}).optional(),

  tag_type: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z
      .string({
        required_error: "Tag Type is a required field",
      })
      .nonempty({ message: "Tag Type is a required field" }),
  ),

  tag_colour: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z
      .string({
        required_error: "Tag Colour is a required field",
      })
      .nonempty({ message: "Tag Colour is a required field" }),
  ),

  tag_placement: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z
      .string({
        required_error: "Tag Placement is a required field",
      })
      .nonempty({ message: "Tag Placement is a required field" }),
  ),

  tag_origin: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z
      .string({
        required_error: "Tag Origin is a required field",
      })
      .nonempty({ message: "Tag Origin is a required field" }),
  ),

  retention_rate_pct: z
    .literal("")
    .transform(() => undefined)
    .or(
      z.coerce
        .number()
        .positive({
          message: "Tag Retention Rate must be greater than 0",
        })
        .max(100, {
          message: "Tag Retention Rate cannot exceed 100%",
        }),
    )
    .optional(),
  retention_rate_sample_size: z
    .literal("")
    .transform(() => undefined)
    .or(
      z.coerce
        .number()
        .min(1, { message: "Sample Size must be greater than 0" })
        .int(),
    )
    .optional(),
  retention_rate_pop_size: z
    .literal("")
    .transform(() => undefined)
    .or(
      z.coerce
        .number()
        .min(1, { message: "Population Size must be greater than 0" })
        .int(),
    )
    //.refine(
    //  (val) => val.retention_rate_sample_size > val.retention_rate_pop_size,
    //  { message: "Population Size must be >= Sample Size" },
    //)
    .optional(),
});

export const AppliedTagSchema = z.union([EmptyTagSchema, FilledTagSchema]);
