import { useQuery } from "@tanstack/react-query";

import { Fn2CodeTable, OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getTagColours = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_colours/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x: Fn2CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export function useTagColours(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.tagColours],
    queryFn: getTagColours,
  });

  return data;
}
