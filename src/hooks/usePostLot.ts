import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreatedLot, CreateLotFormInputs } from "../types/types";
import { queryKeys } from "../react-query/constants";

const postLot = async (body: CreateLotFormInputs): Promise<CreatedLot> => {
  const url = "stocking/api/v1/lot/create/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (response.status !== 201) {
    // print the errrors:
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// we need to rework this - react query considerss success a promise
// that has been resolved.  It doesn't check for errors from the server.

const usePostLot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLot,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.lots],
      });
    },
  });
};

export default usePostLot;
