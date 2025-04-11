import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { StockingAdminUnit } from "../types/types";
import { queryKeys } from "../react-query/constants";

// TODO: parameterize to accept user id someday
const getStockingAdminUnits = async (): Promise<Array<StockingAdminUnit>> => {
  const url = "stocking/api/v1/stocking_admin_units/";
  const { data } = await axiosInstance.get(url);

  data.sort((a: StockingAdminUnit, b: StockingAdminUnit) =>
    a.admin_unit_name > b.admin_unit_name ? 1 : -1,
  );

  return data;
};

export function useStockingAdminUnits(): StockingAdminUnit[] {
  const fallback: StockingAdminUnit[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.stockingAdminUnits],
    queryFn: getStockingAdminUnits,
  });

  return data;
}
