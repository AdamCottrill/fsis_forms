import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { Fn2CodeTable, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getTagPositions = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_positions/";

  const { data } = await axiosInstance.get(url);

  const results = data.map((x: Fn2CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  results.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return results;
};

export function useTagPositions(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.tagPositions],
    queryFn: getTagPositions,
  });

  return data;
}
