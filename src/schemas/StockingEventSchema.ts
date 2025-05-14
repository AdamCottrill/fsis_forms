import { StockingEventInputs } from "../types/types";
import { z, ZodType } from "zod"; // Add new import

//import { AppliedTagSchema } from "./AppliedTagSchema";

export const StockingEventSchema: ZodType<StockingEventInputs> = z
  .object({
    lot_slug: z.string({
      required_error: "Lot Identifier is a required field",
    }),
    stocking_admin_unit_id: z
      .number({
        required_error: "Stocking Admin Unit is a required field",
      })
      .int()
      .positive(),

    publication_date: z.string().date().optional().or(z.literal("")),
    stocking_purposes: z
      .number()
      .positive()
      .int()
      .array()
      .nonempty({ message: "At least one Stocking Purpose must be selected" }),
    proponent_id: z
      .number({
        required_error: "Proponent is a required field",
      })
      .int()
      .positive(),

    release_method_id: z
      .number({
        required_error: "Release Method is a required field",
      })
      .int()
      .positive(),

    stocking_date: z
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

    transit_methods: z.number().positive().int().array().nonempty({
      message: "At least one Transit Method must be selected",
    }),

    destination_waterbody_id: z
      .number({
        required_error: "Destination Waterbody is a required field",
      })
      .int()
      .positive(),

    stocked_waterbody_id: z
      .number({
        required_error: "Stocked Waterbody is a required field",
      })
      .int()
      .positive(),

    stocking_site_id: z
      .number({
        required_error: "Stocking Site is a required field",
      })
      .int()
      .positive(),

    //[41.67, -95.15],
    //[55.86, -74.32],

    latitude_decimal_degrees: z
      .number()
      .min(41.67, {
        message: "Latiude must be greater than 41.67 degrees",
      })
      .max(55.86, {
        message: "Latitude must be less than 55.86 degrees",
      })
      .optional(),
    longitude_decimal_degrees: z
      .number()
      .max(-74.32, {
        message: "Longitude must be less than -74.32 degrees",
      })
      .min(-95.15, {
        message: "Longitude must be greater than -95.15 degrees",
      })
      .optional(),
    fish_stocked_count: z.preprocess(
      (val) => {
        return val === "" ? undefined : val;
      },
      z
        .number({
          required_error: "Number of Fish Stocked is a required field",
        })
        .positive({
          message: "Number of Fish Stocked must be greater than 0",
        })
        .int(),
    ),

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
          .positive({
            message: "Fish Age must be greater than 0",
          })
          .int()
          .max(180, {
            message: "Fish Age must be less than 180 months",
          }),
      )
      .optional(),

    development_stage_id: z
      .number({
        required_error: "Development Stage is a required field",
      })
      .int()
      .positive(),

    // 'U' and '0' can only appear alone
    // 1&2, 3&4, 1&3, and 2&4 can not appear together
    fin_clips: z
      .string()
      .array()
      .nonempty({
        message: "At least one Fin Clip must be selected",
      })
      .superRefine((val, ctx) => {
        if (val.indexOf("0") >= 0 && val.length > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "0 cannot be selected with any other Fin Clip",
          });
        }

        if (val.indexOf("U") >= 0 && val.length > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Unknown cannot be selected with any other Fin Clip",
          });
        }

        if (val.indexOf("1") >= 0 && val.indexOf("2") >= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Clip 1 and 2 cannot be selected together",
          });
        }

        if (val.indexOf("1") >= 0 && val.indexOf("3") >= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Clip 1 and 3 cannot be selected together",
          });
        }

        if (val.indexOf("2") >= 0 && val.indexOf("4") >= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Clip 2 and 4 cannot be selected together",
          });
        }

        if (val.indexOf("3") >= 0 && val.indexOf("4") >= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Clip 3 and 4 cannot be selected together",
          });
        }
      }),

    clip_retention_pct: z
      .number()
      .min(0, { message: "Clip Retention must be greater than 0" })
      .max(100, { message: "Clip Retention Rate cannot exceed 100%" })
      .optional(),
    //tags_applied: ?AppliedTag[];
    inventory_comments: z.string().optional(),
    marking_comments: z.string().optional(),
    stocking_comments: z.string().optional(),

    oxytetracycline: z.boolean().optional(),
    brand: z.boolean().optional(),
    fluorescent_dye: z.boolean().optional(),
    other_mark: z.boolean().optional(),
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
        message: "longitude is required if latitude is provided",
      });
    }

    if (!data.latitude_decimal_degrees && data.longitude_decimal_degrees) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["latitude_decimal_degrees"],
        message: "latitude is required if longitude is provided",
      });
    }
  });
