import { version } from "punycode";
import { validateDevStageAndFishAge } from "./StockingEventSchema";

// the function validateDevStageAndFishAge should return true if the
// age and the development stage are consistent, otherwise false

test("good combinations of dev stage and fish age return true", () => {
  expect(validateDevStageAndFishAge(0, "10")).toBe(true);
  expect(validateDevStageAndFishAge(0, "11")).toBe(true);
  expect(validateDevStageAndFishAge(0, "12")).toBe(true);
  expect(validateDevStageAndFishAge(1, "81")).toBe(true);
  expect(validateDevStageAndFishAge(2, "31")).toBe(true);
  expect(validateDevStageAndFishAge(6, "32")).toBe(true);
  expect(validateDevStageAndFishAge(15, "51")).toBe(true);
  expect(validateDevStageAndFishAge(20, "50")).toBe(true);
  expect(validateDevStageAndFishAge(20, "52")).toBe(true);
  expect(validateDevStageAndFishAge(20, "53")).toBe(true);
});

test("bad combinations of dev stage and fish age return false", () => {
  // eggs - must be 0

  expect(validateDevStageAndFishAge(1, "10")).toBe(false);
  expect(validateDevStageAndFishAge(1, "11")).toBe(false);
  expect(validateDevStageAndFishAge(1, "12")).toBe(false);
  // sac fry, 0 or 1 are valid
  expect(validateDevStageAndFishAge(2, "81")).toBe(false);

  // fry  1 or 2 are valid
  expect(validateDevStageAndFishAge(0, "31")).toBe(false);
  expect(validateDevStageAndFishAge(3, "31")).toBe(false);

  // fingerlings - 3-9 are valid
  expect(validateDevStageAndFishAge(2, "32")).toBe(false);
  expect(validateDevStageAndFishAge(10, "32")).toBe(false);

  // yearings 10-19 are valid
  expect(validateDevStageAndFishAge(9, "51")).toBe(false);
  expect(validateDevStageAndFishAge(20, "51")).toBe(false);

  // juveniles and adults - must be at least 20
  expect(validateDevStageAndFishAge(19, "50")).toBe(false);
  expect(validateDevStageAndFishAge(19, "52")).toBe(false);
  expect(validateDevStageAndFishAge(19, "53")).toBe(false);
});
