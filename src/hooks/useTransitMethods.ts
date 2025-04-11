import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { OptionsTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getTransitMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/transit_methods/";

  const { data } = await axiosInstance.get(url);

  data.sort((a: CodeTable, b: CodeTable) =>
    a.description > b.description ? 1 : -1,
  );

  return data;
};

export function useTransitMethods(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.transitMethods],
    queryFn: getTransitMethods,
  });

  return data;
}
