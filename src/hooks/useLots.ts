import { useQuery } from "@tanstack/react-query";

import { PreLot, Lot } from "../types/types";

const getLots = async (): Promise<Array<Lot>> => {
  const url = "stocking/api/v1/lots/";
  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  const results2 = results.map((x: PreLot) => ({
    ...x,
    strain_slug: `${x.species_code}-${x.strain_code}`,
    lot_id: x.id,
  }));
  //return { ...payload, results: results2 };
  return results2;
};

export function useLots(): Lot[] {
  const fallback: Lot[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["lots"],
    queryFn: getLots,
  });

  return data;
}
