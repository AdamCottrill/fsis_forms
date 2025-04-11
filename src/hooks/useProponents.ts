import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { Proponent, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getProponents = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/proponents/";

  const { data } = await axiosInstance.get(url);

  const results = data.results.map((x: Proponent) => {
    return {
      value: x.slug,
      label: `${x.proponent_name} (${x.proponent_abbrev})`,
    };
  });

  results.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return results;
};

export function useProponents(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.proponents],
    queryFn: getProponents,
  });

  return data;
}
