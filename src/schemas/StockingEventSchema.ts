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
      .refine(
        (val) => {
          const today = new Date();
          const event_date = new Date(val);
          return today >= event_date;
        },
        {
          message: "Stocking Date cannot be in the future",
        },
      ),
    //stocking_time!!

    transit_mortality: z.number().positive().optional(),

    site_temperature: z.number().min(-10).max(30).optional(),

    rearing_temperature: z.number().min(-10).max(30).optional(),
    water_depth: z.number().positive().max(300).optional(),
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

    latitude_decimal_degrees: z.number().min(41.0).max(49.0).optional(),
    longitude_decimal_degrees: z.number().max(-78.0).min(-88.0).optional(),
    fish_stocked_count: z
      .number({
        required_error: "Fish Stocked is a required field",
      })
      .positive()
      .int(),
    fish_weight: z.number().positive().optional(),
    fish_age: z.number().positive().int().max(180),
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

    cip_retention_pct: z.number().min(0).max(100).optional(),
    //tags_applied: ?AppliedTag[];
    inventory_comments: z.string().optional(),
    marking_comments: z.string().optional(),
    stocking_comments: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const one_year = ((d) => d.setFullYear(d.getFullYear() + 1))(new Date());
    const next_year = new Date(one_year);
    const pub_date = new Date(data.publication_date);
    if (pub_date > next_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: "publication_date",
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
        path: "publication_date",
        message: "Publication Date cannot occur before Stocking Event Date",
      });
    }
  });
