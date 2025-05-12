import { CreateLotFormInputs } from "../types/types";
import { z, ZodType } from "zod"; // Add new import

const earliest = new Date().getFullYear() - 14;
const latest = new Date().getFullYear();

export const CreateLotSchema: ZodType<CreateLotFormInputs> = z.object({
  spc: z
    .string({
      required_error: "zod: Species is a required field",
    })
    .regex(/\d{3}/),
  species_strain_id: z
    .number({
      required_error: "zod: Strain is a required field",
    })
    .positive(),
  rearing_location_id: z
    .number({
      required_error: "zod: Rearing Location is a required field",
    })
    .positive(),

  spawn_year: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return parseInt(val, 10);
        } catch {
          return undefined;
        }
      } else if (typeof val === "number") {
        return val;
      } else {
        return undefined;
      }
    },
    z
      .number({
        required_error: "zod: Spawn Year is a required field",
        invalid_type_error: `Spawn Year must be a number between ${earliest} and ${latest}`,
      })
      .min(earliest, { message: "Spawn Year must be greater than 1950" })
      .refine(
        (spawn_year) => {
          // message is returned if function is false
          return spawn_year <= new Date().getFullYear();
        },
        { message: "Spawn Year cannot be in the future" },
      ),
  ),

  lot_num: z.preprocess(
    (val) => val.trim(),

    z
      .string()
      .toUpperCase()
      .regex(/^\d{3}?[A-Z]$/, {
        message:
          "Lot Number must start with 3 digits followed by an optional letter",
      })
      //.transform((value) => (value === "" ? null : value))
      .or(z.literal("")),
  ),
});
