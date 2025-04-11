import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { PreLot, Lot } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getLots = async (): Promise<Array<Lot>> => {
  const url = "stocking/api/v1/lots/";
  const { data } = await axiosInstance.get(url);

  const { results } = data;

  const results2 = results.map((x: PreLot) => ({
    ...x,
    strain_slug: `${x.species_code}-${x.strain_code}`,
    lot_id: x.id,
  }));

  results2.sort((a: Lot, b: Lot) => (a.slug > b.slug ? 1 : -1));

  return results2;
};

export function useLots(): Lot[] {
  const fallback: Lot[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.lots],
    queryFn: getLots,
  });

  return data;
}
