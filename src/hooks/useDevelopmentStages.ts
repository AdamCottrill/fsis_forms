import { useQuery } from "@tanstack/react-query";

import { CodeTable, OptionsTable } from "../types/types";
import { queryKeys} from "../react-query/constants";


const getDevelopmentStages = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/development_stages/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x:CodeTable) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};


export function useDevelopmentStages(): OptionsTable[] {
  const fallback: OptionsTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.developmentStages],
    queryFn: getDevelopmentStages,
  });

  return data;
}
