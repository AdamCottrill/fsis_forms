import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { Fn2CodeTable } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getFinClips = async (): Promise<Array<Fn2CodeTable>> => {
  const url = "stocking/api/v1/fin_clips/";
  const { data } = await axiosInstance.get(url);
  return data;
};

//// queryInfo, no fallback
export const useFinClips = () => {
  const queryInfo = useQuery({
    queryKey: [queryKeys.finClips],
    queryFn: getFinClips,
  });

  return queryInfo;
};

//// just data with fallback:
//export function useFinClips(): Fn2CodeTable[] {
//  const fallback: Fn2CodeTable[] = [];
//  const { data = fallback } = useQuery({
//    queryKey: [queryKeys.finClips],
//    queryFn: getFinClips,
//  });
//
//  return data;
//}
//
