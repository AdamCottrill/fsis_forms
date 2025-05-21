import { render as RtRender } from "@testing-library/react";
import { ReactElement } from "react";

import { MemoryRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const generateQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateQueryClient();

  return RtRender(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

export function createWrapper() {
  const queryClient = generateQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export * from "@testing-library/react";
export { customRender as render };
