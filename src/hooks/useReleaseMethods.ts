import { useQuery } from "@tanstack/react-query";

import { CodeTable, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getReleaseMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/release_methods/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x: CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export function useReleaseMethods(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.releaseMethods],
    queryFn: getReleaseMethods,
  });

  return data;
}
