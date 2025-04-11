import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { CodeTable, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getReleaseMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/release_methods/";
  const { data } = await axiosInstance.get(url);

  const results = data.map((x: CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  results.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );

  return results;
};

export function useReleaseMethods(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.releaseMethods],
    queryFn: getReleaseMethods,
  });

  return data;
}
