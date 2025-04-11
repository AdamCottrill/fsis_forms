import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { RearingLocation, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getRearingLocations = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/rearing_locations/";

  const { data } = await axiosInstance.get(url);

  const results = data.results.map((x: RearingLocation) => {
    return { value: x.id, label: `${x.name} (${x.abbrev})` };
  });

  results.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return results;
};

export function useRearingLocations(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.rearingLocations],
    queryFn: () => getRearingLocations(),
  });

  return data;
}
