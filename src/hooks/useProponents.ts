import { useQuery } from "@tanstack/react-query";

import { Proponent, OptionsTable } from "../types/types";

const getProponents = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/proponents/";

  const payload = await fetch(url).then((res) => res.json());

  const data = payload.results.map((x: Proponent) => {
    return {
      value: x.slug,
      label: `${x.proponent_name} (${x.proponent_abbrev})`,
    };
  });

  data.sort((a: OptionsTable, b: OptionsTable) => (a.label > b.label ? 1 : -1));

  return data;
};

export function useProponents(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["proponents"],
    queryFn: getProponents,
  });

  return data;
}
