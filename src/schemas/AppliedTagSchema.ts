import { AppliedTagInputs } from "../types/types";
import { z, ZodType } from "zod"; // Add new import

export const AppliedTagSchema: ZodType<AppliedTagInputs> = z.object({
  series_start: z.string({
    required_error: "Series Start is a required field",
  }),
  series_end: z.string({}).optional(),

  tag_type_id: z
    .number({
      required_error: "Tag Type is a required field",
    })
    .int()
    .positive(),

  tag_colour_id: z
    .number({
      required_error: "Tag Colour is a required field",
    })
    .int()
    .positive(),

  tag_placement_id: z
    .number({
      required_error: "Tag Placement is a required field",
    })
    .int()
    .positive(),

  tag_origin_id: z
    .number({
      required_error: "Tag Origin is a required field",
    })
    .int()
    .positive(),

  retention_rate_pct: z
    .number()
    .min(0, { message: "Retention Rate must be greater than or equal to 0" })
    .max(100, { message: "Retention Rate must be less than 100" })
    .optional(),
  retention_rate_sample_size: z
    .number()
    .min(1, { message: "Sample Size must be greater than 0" })
    .int()
    .optional(),
  retention_rate_pop_size: z
    .number()
    .min(1, { message: "Population Size must be greater than 0" })
    .int()
    //.refine(
    //  (val) => val.retention_rate_sample_size > val.retention_rate_pop_size,
    //  { message: "Population Size must be >= Sample Size" },
    //)
    .optional(),
});
