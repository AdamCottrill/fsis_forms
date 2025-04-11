import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { Fn2CodeTable, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getTagOrigins = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_origins/";

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

export function useTagOrigins(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.tagOrigins],
    queryFn: getTagOrigins,
  });

  return data;
}
