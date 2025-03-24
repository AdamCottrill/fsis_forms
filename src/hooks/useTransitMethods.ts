import { useQuery } from "@tanstack/react-query";

import { OptionsTable } from "../types/types";


const getTransitMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/transit_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};


export function useTransitMethods(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["transit-methods"],
    queryFn: getTransitMethods,
  });

  return data;
}
