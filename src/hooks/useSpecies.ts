import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { Species, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getSpecies = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/species/";
  const { data } = await axiosInstance.get(url);

  const payload = data.results.map((x: Species) => {
    return {
      value: x.spc,
      label: `${x.spc_nmco} (${x.spc_nmsc}) [${x.spc}]`,
    };
  });
  payload.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return payload;
};

export function useSpecies(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.species],
    queryFn: getSpecies,
  });

  return data;
}
