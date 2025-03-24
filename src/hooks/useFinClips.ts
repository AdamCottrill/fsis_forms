import { useQuery } from "@tanstack/react-query";

import { Fn2CodeTable } from "../services/types";

const getFinClips = async (): Promise<Array<Fn2CodeTable>> => {
  const url = "stocking/api/v1/fin_clips/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export function useFinClips(): Fn2CodeTable[] {
  const fallback: Fn2CodeTable[] = [];

  const { data = fallback } = useQuery({
    queryKey: ["fin-clips"],
    queryFn: getFinClips,
  });

  return data;
}
