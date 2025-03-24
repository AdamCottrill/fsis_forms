import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreatedLot, CreateLotFormInputs } from "../types/types";

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

  if (!response.ok) {
    debugger;
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const usePostLot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLot,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["lots"],
      });
    },
  });
};

export default usePostLot;
