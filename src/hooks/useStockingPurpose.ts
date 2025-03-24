import { useQuery } from "@tanstack/react-query";

import { CodeTable } from "../types/types";

export const getStockingPurposes = async (): Promise<Array<CodeTable>> => {
  const url = "stocking/api/v1/stocking_purposes/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export function useStockingPurposes(): CodeTable[] {
  const fallback: CodeTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["stocking-purposes"],
    queryFn: getStockingPurposes,
  });

  return data;
}
