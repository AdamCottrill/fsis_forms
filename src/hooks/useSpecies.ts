import { useQuery } from "@tanstack/react-query";

import { Species, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getSpecies = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/species/";
  const payload = await fetch(url).then((res) => res.json());

  const data = payload.results.map((x: Species) => {
    return {
      value: x.spc,
      label: `${x.spc_nmco} (${x.spc_nmsc}) [${x.spc}]`,
    };
  });
  data.sort((a: OptionsTable, b: OptionsTable) => (a.label > b.label ? 1 : -1));

  return data;
};

export function useSpecies(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.species],
    queryFn: getSpecies,
  });

  return data;
}
