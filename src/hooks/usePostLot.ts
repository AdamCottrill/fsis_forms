import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../axiosInstance";
import { CreatedLot, CreateLotFormInputs } from "../types/types";
import { queryKeys } from "../react-query/constants";
import { TbBrandMonday } from "react-icons/tb";

const postLot = async (payload: CreateLotFormInputs): Promise<CreatedLot> => {
  const url = "stocking/api/v1/lot/create/";

  // const response = await axiosInstance
  //   .post(url, payload)
  //   .then((response) => console.log(response))
  //   .catch((error) => console.error(error));

  try {
    const response = await axiosInstance.post(url, payload);
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("server responded with an error");
      throw new Error(JSON.stringify(error.response.data));
    } else if (error.request) {
      console.log("network error");
    } else {
      console.log(error.toJSON());
    }
  }

  // if (response.status !== 201) {
  //     console.log(data);
  //   throw new Error(JSON.stringify(data));
  // }

  // return data;
};

// we need to rework this - react query considers success a promise
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
