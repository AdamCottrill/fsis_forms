import { Lot, SelectChoice } from "./types/types";

// create an key-value array of objects for drop-down lists in fsis-infinity forms
export const get_value_labels = (
  data: Lot[],
  value: keyof typeof Lot,
  label: keyof typeof Lot,
  descending: boolean = false,
  null_string?: string,
): SelectChoice[] => {
  const sort_order = descending === false ? 1 : -1;

  if (!data) {
    return [];
  }

  const tmp = new Map(
    data.map((x) => [
      x[value],
      {
        value: x[value],
        label: label == value ? x[value] : `${x[label]} (${x[value]})`,
      },
    ]),
  );
  const value_labels = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 * sort_order : -1 * sort_order,
  );

  if (null_string) {
    value_labels.splice(0, 0, { value: "", label: null_string });
  }

  return value_labels;
};

interface ParsedLot {
  lot_num: string;
  spawn_year: number;
  species: string;
  strain: string;
  rearing_location: string;
}

export const parseLotSlug = (Lots: Lot[], slug: string): ParsedLot | {} => {
  const lot = Lots.filter((x) => x?.slug === slug);

  // extract the lot_number, species, strain, proponent, rearing location, funding_type, and spawn year
  // and return them in an object that can be used to present this information to our user:

  if (lot.length) {
    let parsed: ParsedLot = {
      lot_num: lot[0].lot_num,
      spawn_year: lot[0].spawn_year,
      species: `${lot[0].species_name} (${lot[0].species_code})`,
      strain: `${lot[0].strain_name} (${lot[0].strain_code})`,
      rearing_location: `${lot[0].rearing_location_name} (${lot[0].rearing_location_abbrev})`,
    };
    return parsed;
  } else {
    return {};
  }
};
