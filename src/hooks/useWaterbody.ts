import { useQuery } from "@tanstack/react-query";

import { OptionsTable, Waterbody } from "../services/types";

export const getWaterbodies = async (
  waterbody_like: string | null,
): Promise<Array<OptionsTable>> => {
  let url = "stocking/api/v1/stocked_waterbodies/";
  if (waterbody_like) url += "?waterbody__like=" + waterbody_like;
  const payload = await fetch(url).then((res) => res.json());
  // the view is paginate

  const { results } = payload;
  const results2 = results.map((d: Waterbody) => ({
    value: d.waterbody_identifier,
    label: `${d.label} <${d.waterbody_identifier}>)`,
  }));

  return results2.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );
};

export function useWaterbodies(
  waterbody_name_like: string | null,
): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["waterbody", waterbody_name_like],
    queryFn: () => getWaterbodies(waterbody_name_like),
  });

  return data;
}
