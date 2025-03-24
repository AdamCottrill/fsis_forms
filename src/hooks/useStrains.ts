import { useQuery } from "@tanstack/react-query";

import { OptionsTable, Strain } from "../services/types";

const getStrains = async (
  spc?: string,
): Promise<Array<OptionsTable>> => {
  let url = "stocking/api/v1/strains/";

  if (typeof spc !== "undefined") {
    url += `?spc=${spc}`;
  }

  const payload = await fetch(url).then((res) => res.json());

  const data = payload.results.map((x: Strain) => {
    return {
      value: x.id,
      label: `${x.strain_name} (${x.strain_code})`,
    };
  });

  data.sort((a: OptionsTable, b: OptionsTable) => (a.label > b.label ? 1 : -1));

  return data;
};

export function useStrains(species: string): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["strains", species],
    queryFn: () => getStrains(species),
    enabled: !!species,
  });

  return data;
}
