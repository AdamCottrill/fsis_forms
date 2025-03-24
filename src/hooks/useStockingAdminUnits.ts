import { useQuery } from "@tanstack/react-query";

import { StockingAdminUnit } from "../types/types";


// TODO: parameterize to accept user id someday
const getStockingAdminUnits = async (): Promise<
  Array<StockingAdminUnit>
> => {
  const url = "stocking/api/v1/stocking_admin_units/";
  const payload = await fetch(url).then((res) => res.json());

  return payload;
};


export function useStockingAdminUnits(): StockingAdminUnit[] {
  const fallback: StockingAdminUnit[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["stocking-admin-units"],
    queryFn: getStockingAdminUnits,
  });

  return data;
}
