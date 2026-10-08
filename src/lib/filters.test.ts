import { describe, it, expect } from "vitest";
import {
  ALL_PAYMENT_TYPES,
  buildWhere,
  MAX_MILES_DISTANCE,
} from "./filters";
import type { Filters } from "../types";

const testFilter: Filters = {
  fareAmount: 0,
  milesDistance: [0, MAX_MILES_DISTANCE],
  paymentType: ALL_PAYMENT_TYPES,
  passengerNumber: 0,
  hideNegativeFare: false,
};

describe("buildWhere", () => {
  it("returns an empty string with default filters", () => {
    const result = buildWhere(testFilter);
    expect(result).toBe("");
  });
  it("returns a minimum fare condition", () => {
    const result = buildWhere({ ...testFilter, fareAmount: 50 });
    expect(result).toBe("WHERE fare_cents >= 5000");
  });
  it("returns a condition to hide negative amounts", () => {
    const result = buildWhere({ ...testFilter, hideNegativeFare: true });
    expect(result).toBe("WHERE fare_cents >= 0");
  });
  it("returns a minimum miles distance condition with min and max", () => {
    const result = buildWhere({
      ...testFilter,
      milesDistance: [15, 450],
    });
    expect(result).toBe(
      "WHERE distance_cent >= 1500 AND distance_cent <= 45000",
    );
  });
  it("returns a minimum miles condition with only min", () => {
    const result = buildWhere({
      ...testFilter,
      milesDistance: [30, MAX_MILES_DISTANCE],
    });
    expect(result).toBe("WHERE distance_cent >= 3000");
  });
  it("returns a minimum miles condition with only max", () => {
    const result = buildWhere({
      ...testFilter,
      milesDistance: [0, 120],
    });
    expect(result).toBe("WHERE distance_cent <= 12000");
  });
  it("returns a payment type condition", () => {
    const result   = buildWhere({ ...testFilter, paymentType: 1 });
    expect(result).toBe("WHERE payment_type = 1");
  });
  it("returns a condition based on the number of passengers", () => {
    const result = buildWhere({ ...testFilter, passengerNumber: 4 });
    expect(result).toBe("WHERE passengers >= 4");
  });
  it("returns a string with all the conditions", () => {
    const result = buildWhere({
      fareAmount: 15,
      milesDistance: [20, 300],
      paymentType: 4,
      passengerNumber: 3,
      hideNegativeFare: true,
    });
    expect(result).toBe(
      "WHERE distance_cent >= 2000 AND distance_cent <= 30000 AND fare_cents >= 1500 AND payment_type = 4 AND passengers >= 3 AND fare_cents >= 0",
    );
  });
});
