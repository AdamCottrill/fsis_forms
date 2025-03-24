import { useQuery } from "@tanstack/react-query";

import { RearingLocation, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getRearingLocations = async (
  proponent_slug?: string,
): Promise<Array<OptionsTable>> => {
  let url = "stocking/api/v1/rearing_locations/";
  if (typeof proponent_slug !== "undefined") {
    url += `?proponent=${proponent_slug}`;
  }

  const payload = await fetch(url).then((res) => res.json());

  const data = payload.results.map((x: RearingLocation) => {
    return { value: x.id, label: `${x.name} (${x.abbrev})` };
  });

  data.sort((a: OptionsTable, b: OptionsTable) => (a.label > b.label ? 1 : -1));

  return data;
};

export function useRearingLocations(proponent: string): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.rearingLocations, proponent],

    queryFn: () => getRearingLocations(proponent),
    enabled: !!proponent,
  });

  return data;
}
