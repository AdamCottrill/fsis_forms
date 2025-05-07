import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { TableDefinition } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getTableDefinition = async (
  table_name: string,
): Promise<TableDefinition> => {
  const url = `data_dictionary/api/v1/table/${table_name}/`;

  const { data } = await axiosInstance.get(url);

  return data;
};

export function useTableDefinition(
  table_name: string,
  enabled: boolean,
): TableDefinition | {} {
  return useQuery({
    queryKey: [queryKeys.tableDefinition, table_name],
    queryFn: () => getTableDefinition(table_name),
    placeholderData: {},
    enabled: !!enabled,
  });
}
