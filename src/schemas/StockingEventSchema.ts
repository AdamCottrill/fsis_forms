import { StockingEventInputs } from "../types/types";
import { z, ZodType } from "zod"; // Add new import

import { AppliedTagSchema } from "./AppliedTagSchema";

//const choice = z.object({ label: z.string(), value: z.string() });

export const validateDevStageAndFishAge = (
  fish_age: number,
  dev_stage: string,
): boolean => {
  if (["10", "11", "12"].indexOf(dev_stage) >= 0 && fish_age != 0) {
    return false;
  } else if (["50", "52", "53"].indexOf(dev_stage) >= 0 && fish_age < 20) {
    return false;
  } else if (dev_stage === "81" && fish_age > 1) {
    return false;
  } else if (dev_stage === "31" && (fish_age < 1 || fish_age > 2)) {
    return false;
  } else if (dev_stage === "32" && (fish_age < 3 || fish_age > 9)) {
    return false;
  } else if (dev_stage === "51" && (fish_age < 10 || fish_age > 19)) {
    return false;
  } else {
    return true;
  }
};

export const StockingEventSchema: ZodType<StockingEventInputs> = z
  .object({
    lot_slug: z
      .string({
        required_error: "Lot Identifier is a required field",
      })
      .nonempty({ message: "Lot Identifier is a required field" }),
    stocking_admin_unit_id: z.preprocess(
      (x) => (x === null ? undefined : x),

      z
        .number({
          required_error: "Stocking Admin Unit is a required field",
        })
        .int()
        .positive(),
    ),

    publication_date: z.string().date().optional().or(z.literal("")),
    stocking_purposes: z.preprocess(
      (val) => {
        return val === undefined ? [] : val;
      },
      z.string().array().nonempty({
        message: "At least one Stocking Purpose must be selected",
      }),
    ),
    proponent_id: z.preprocess(
      (val) => {
        return val === "" || val == null ? undefined : val;
      },
      z.string({
        required_error: "Proponent is a required field",
      }),
    ),
    release_method: z.preprocess(
      (val) => {
        return val === "" || val === null ? undefined : val;
      },
      z.string({
        required_error: "Release Method is a required field",
      }),
    ),

    stocking_date: z.preprocess(
      (val) => {
        return val === "" ? undefined : val;
      },
      z
        .string({
          required_error: "Stocking Date is a required field",
        })
        .date()
        .superRefine((val, ctx) => {
          const today = new Date();
          const event_date = new Date(val);

          if (today < event_date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Stocking Date cannot be in the future",
            });
          }

          if (event_date.getFullYear() < 1900) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Stocking dates before 1900 are not allowed.",
            });
          }
        }),
    ),
    //stocking_time!!

    transit_mortality: z.coerce
      .number()
      .int()
      .min(0, {
        message: "Transit Mortality must be greater than or equal to 0",
      })
      .optional(),

    site_temperature: z.coerce
      .number()
      .min(-10, {
        message: "Site Temperature must be greater than -10",
      })
      .max(30, {
        message: "Site Temperature must be less than 30",
      })
      .optional(),

    rearing_temperature: z.coerce
      .number()
      .min(-10, {
        message: "Rearing Temperature must be greater than -10",
      })
      .max(30, {
        message: "Rearing Temperature must be less than 30",
      })
      .optional(),
    water_depth: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .positive({ message: "Water Depth must be greater than 0 m" })
          .max(400, { message: "Water Depth must be less than 400 m" }),
      )
      .optional(),

    transit_methods: z.preprocess(
      (val) => {
        return val === undefined ? [] : val;
      },

      z
        .string()
        .array()
        .nonempty({
          message: "At least one Transit Method must be selected",
        })
        .superRefine((val, ctx) => {
          if (val.indexOf("UNKN") >= 0 && val.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "UNKN cannot be selected with any other Transit method",
            });
          }
        }),
    ),

    destination_waterbody: z.preprocess(
      (x) => x?.value || undefined,
      z.string({
        required_error: "Destination Waterbody is a required field",
      }),
    ),

    stocked_waterbody: z.preprocess(
      (x) => x?.value || undefined,
      z.string({
        required_error: "Stocked Waterbody is a required field",
      }),
    ),

    stocking_site: z.preprocess(
      (x) => x?.value || undefined,
      z
        .number({ required_error: "Stocking Site is a required field" })
        .positive()
        .int(),
    ),

    //[41.67, -95.15],
    //[55.86, -74.32],

    latitude_decimal_degrees: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .min(41.67, {
            message: "Latiude must be greater than 41.67 degrees",
          })
          .max(55.86, {
            message: "Latitude must be less than 55.86 degrees",
          }),
      )
      .optional(),

    longitude_decimal_degrees: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .max(-74.32, {
            message: "Longitude must be less than -74.32 degrees",
          })
          .min(-95.15, {
            message: "Longitude must be greater than -95.15 degrees",
          }),
      )
      .optional(),

    fish_stocked_count: z.union([
      z.coerce
        .number()
        .min(1, {
          message: "Number of Fish Stocked is required and must be positive.",
        })
        .int(),
      z.nan(),
    ]),

    fish_weight: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .positive({
            message: "Fish Weight must be greater than 0 g",
          })
          .max(20000, {
            message: "Fish Weight must be less than 20000 g",
          }),
      )
      .optional(),

    fish_age: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .min(0, {
            message: "Fish Age must be greater than or equal to 0",
          })
          .int()
          .max(180, {
            message: "Fish Age must be less than 180 months",
          }),
      )
      .optional(),

    development_stage_id: z.preprocess(
      (val) => {
        return val === "" || val == null ? undefined : val;
      },
      z.string({
        required_error: "Development Stage is a required field",
      }),
    ),

    // 'U' and '0' can only appear alone
    // 1&2, 3&4, 1&3, and 2&4 can not appear together
    // 1 -> RPECT
    // 2 -> LPECT
    // 3 -> RVENT
    // 4 -> LVENT

    fin_clips: z.preprocess(
      (val) => {
        return val === undefined ? [] : val;
      },

      z
        .string()
        .array()
        .nonempty({
          message: "At least one Fin Clip must be selected",
        })
        .superRefine((val, ctx) => {
          if (val.indexOf("NONE") >= 0 && val.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "NONE cannot be selected with any other Fin Clip",
            });
          }

          if (val.indexOf("UNKN") >= 0 && val.length > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "UNKN cannot be selected with any other Fin Clip",
            });
          }

          if (val.indexOf("RPECT") >= 0 && val.indexOf("LPECT") >= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Clip RPECT and LPECT cannot be selected together",
            });
          }

          if (val.indexOf("RPECT") >= 0 && val.indexOf("RVENT") >= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Clip RPECT and RVENT cannot be selected together",
            });
          }

          if (val.indexOf("LPECT") >= 0 && val.indexOf("LVENT") >= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Clip LPECT and LVENT cannot be selected together",
            });
          }

          if (val.indexOf("RVENT") >= 0 && val.indexOf("LVENT") >= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Clip RVENT and LVENT cannot be selected together",
            });
          }
        }),
    ),

    clip_retention_pct: z
      .literal("")
      .transform(() => undefined)
      .or(
        z.coerce
          .number()
          .positive({
            message: "Clip Retention Rate must be greater than 0",
          })
          .max(100, {
            message: "Clip Retention Rate cannot exceed 100%",
          }),
      )
      .optional(),

    tags_applied: z.array(AppliedTagSchema).optional(),

    inventory_comments: z.string().optional(),
    marking_comments: z.string().optional(),
    stocking_comments: z.string().optional(),

    oxytetracycline: z.boolean().optional(),
    brand: z.boolean().optional(),
    fluorescent_dye: z.boolean().optional(),
    other_marks: z.boolean().optional(),
    other_marks_description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const one_year = ((d) => d.setFullYear(d.getFullYear() + 1))(new Date());
    const next_year = new Date(one_year);

    const pub_date = data.publication_date
      ? new Date(data.publication_date)
      : undefined;

    if (pub_date && pub_date > next_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publication_date"],
        message:
          "Publication Date more than a year in the future is not allowed.",
      });
    }

    if (
      data.publication_date &&
      data.stocking_date &&
      data.publication_date < data.stocking_date
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publication_date"],
        message: "Publication Date cannot occur before Stocking Event Date",
      });
    }

    if (data.latitude_decimal_degrees && !data.longitude_decimal_degrees) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["longitude_decimal_degrees"],
        message: "Longitude is required if Latitude is provided",
      });
    }

    if (!data.latitude_decimal_degrees && data.longitude_decimal_degrees) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["latitude_decimal_degrees"],
        message: "Latitude is required if Longitude is provided",
      });
    }

    // fish age in months must be consistent with development stage
    if (typeof data.fish_age === "number" && data.development_stage_id) {
      if (
        !validateDevStageAndFishAge(data.fish_age, data.development_stage_id)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fish_age"],
          message: "Fish Age is not consistent with Development Stage",
        });
      }
    }

    // age min, age max

    if (
      data.other_marks &&
      (data.other_marks_description === undefined ||
        data.other_marks_description == "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_marks_description"],
        message: "Please provide a description of the other marks",
      });
    }
  });
