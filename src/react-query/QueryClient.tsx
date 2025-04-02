import { QueryClient, QueryCache } from "@tanstack/react-query";

import Toast from "../components/Toast";

function errorHandler(errorMsg: string) {
  // const id = "react-query-toast";

  // const action = "fetch";
  // const message = `could not ${action} data: ${
  //   errorMsg ?? "error connecting to server"
  // }`;
  //   Toast({ message = message, headingText: "error", variant: "danger" });
  // }
  console.log(errorMsg);
}

// Create a client
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
});
