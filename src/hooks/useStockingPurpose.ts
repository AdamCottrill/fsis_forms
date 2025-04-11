import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { CodeTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

export const getStockingPurposes = async (): Promise<Array<CodeTable>> => {
  const url = "stocking/api/v1/stocking_purposes/";
  const { data } = await axiosInstance.get(url);

  data.sort((a: CodeTable, b: CodeTable) =>
    a.description > b.description ? 1 : -1,
  );

  return data;
};

export function useStockingPurposes(): CodeTable[] {
  const fallback: CodeTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.stockingPurposes],
    queryFn: getStockingPurposes,
  });

  return data;
}
