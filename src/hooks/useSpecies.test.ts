import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../test-utils";

import { useSpecies } from "./useSpecies";

describe("query hook", () => {
  test("successful query hook", async () => {
    const { result } = renderHook(() => useSpecies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });
});

//test("that the useSpecies hook works as expected", async () => {
//  const { result } = renderHook(() => useSpecies(), {
//    wrapper: createWrapper(),
//  });
//
//  console.log("result1 = ", result);
//
//  await waitFor(() => expect(result.current.isSuccess).toBe(true));
//
//
//  console.log("result2 = ", result);
//
//  expect(result.current.data).toBeDefined();
//});
//
//

import { useFinClips } from "./useFinClips";

test("that the useFinClips hook works as expected", async () => {
  const { result } = renderHook(() => useFinClips(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toBeDefined();
});
