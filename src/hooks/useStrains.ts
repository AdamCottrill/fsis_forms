import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { OptionsTable, Strain } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getStrains = async (spc?: string): Promise<Array<OptionsTable>> => {
  let url = "stocking/api/v1/strains/";

  if (typeof spc !== "undefined") {
    url += `?spc=${spc}`;
  }

  const { data } = await axiosInstance.get(url);

  const results = data.results.map((x: Strain) => {
    return {
      value: x.id,
      label: `${x.strain_name} (${x.strain_code})`,
    };
  });

  results.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return results;
};

export function useStrains(species: string): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.strains, species],
    queryFn: () => getStrains(species),
    enabled: !!species,
  });

  return data;
}
