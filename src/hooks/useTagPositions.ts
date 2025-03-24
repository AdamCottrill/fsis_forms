import { useQuery } from "@tanstack/react-query";

import { Fn2CodeTable, OptionsTable } from "../types/types";

const getTagPositions = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_positions/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x: Fn2CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export function useTagPositions(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["tag-positions"],
    queryFn: getTagPositions,
  });

  return data;
}
