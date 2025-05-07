import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { FieldDefinition } from "../types/types";
import { queryKeys } from "../react-query/constants";

const getFieldDefinition = async (
  field_name: string,
): Promise<FieldDefinition> => {
  const url = `data_dictionary/api/v1/field/${field_name}/`;

  const { data } = await axiosInstance.get(url);

  return data;
};

export function useFieldDefinition(
  field_name: string,
  enabled: boolean,
): FieldDefinition | {} {
  return useQuery({
    queryKey: [queryKeys.fieldDefinition, field_name],
    queryFn: () => getFieldDefinition(field_name),
    placeholderData: {},
    enabled: !!enabled,
  });
}
