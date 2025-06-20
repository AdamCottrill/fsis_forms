import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { OptionsTable, Waterbody } from "../types/types";
import { queryKeys } from "../react-query/constants";

export const getWaterbodies = async (
  waterbody_like: string | null,
): Promise<Array<OptionsTable>> => {
  let url = "stocking/api/v1/stocked_waterbodies/";
  if (waterbody_like) url += "?waterbody__like=" + waterbody_like;

  const { data } = await axiosInstance.get(url);

  // the view is paginated
  const { results } = data;
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
    queryKey: [queryKeys.waterbodies, waterbody_name_like],
    queryFn: () => getWaterbodies(waterbody_name_like),
  });

  return data;
}
