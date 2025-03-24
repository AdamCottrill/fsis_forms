import { useQuery } from "@tanstack/react-query";

import { Fn2CodeTable, OptionsTable } from "../services/types";

const getTagTypes = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_types/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x: Fn2CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export function useTagTypes(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["tag-types"],
    queryFn: getTagTypes,
  });

  return data;
}
