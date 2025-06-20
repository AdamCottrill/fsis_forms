import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { OptionsTable, StockingSite } from "../types/types";
import { queryKeys } from "../react-query/constants";

export const getStockingSites = async (
  site_name_like: string,
): Promise<Array<OptionsTable>> => {
  // fetches data from the stocking_sites api endpoint and returns
  // a sorted array of objects with attributes value and label;
  let url = "stocking/api/v1/stocking_sites/";
  if (site_name_like) url += "?site_name__like=" + site_name_like;
  const { data } = await axiosInstance.get(url);
  // the view is paginated

  const { results } = data;
  const results2 = results.map((d: StockingSite) => ({
    value: d.id,
    label: `${d.stocking_site_name} [site_id=${d.id}] (${d.waterbody_name} <${d.waterbody_wbylid}>)`,
  }));

  return results2.sort((a: OptionsTable, b: OptionsTable) =>
    a.label > b.label ? 1 : -1,
  );
};

export function useStockingSites(site_name_like: string): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.stockingSites, site_name_like],
    queryFn: () => getStockingSites(site_name_like),
  });

  return data;
}
