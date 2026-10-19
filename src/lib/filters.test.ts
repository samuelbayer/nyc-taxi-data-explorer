import { describe, it, expect } from "vitest";
import {buildWhere, countActiveFilters, DEFAULT_FILTERS, MAX_MILES_DISTANCE } from "./filters";

describe("buildWhere", () => {
  it("returns an empty string with default filters", () => {
    const result = buildWhere(DEFAULT_FILTERS);
    expect(result).toBe("");
  });
  it("returns a minimum fare condition", () => {
    const result = buildWhere({ ...DEFAULT_FILTERS, fareAmount: 50 });
    expect(result).toBe("WHERE fare_cents >= 5000");
  });
  it("returns a condition to hide negative amounts", () => {
    const result = buildWhere({ ...DEFAULT_FILTERS, hideNegativeFare: true });
    expect(result).toBe("WHERE fare_cents >= 0");
  });
  it("returns a minimum miles distance condition with min and max", () => {
    const result = buildWhere({
      ...DEFAULT_FILTERS,
      milesDistance: [15, 450],
    });
    expect(result).toBe(
      "WHERE distance_cent >= 1500 AND distance_cent <= 45000",
    );
  });
  it("returns a minimum miles condition with only min", () => {
    const result = buildWhere({
      ...DEFAULT_FILTERS,
      milesDistance: [30, MAX_MILES_DISTANCE],
    });
    expect(result).toBe("WHERE distance_cent >= 3000");
  });
  it("returns a minimum miles condition with only max", () => {
    const result = buildWhere({
      ...DEFAULT_FILTERS,
      milesDistance: [0, 120],
    });
    expect(result).toBe("WHERE distance_cent <= 12000");
  });
  it("returns a payment type condition", () => {
    const result = buildWhere({ ...DEFAULT_FILTERS, paymentType: 1 });
    expect(result).toBe("WHERE payment_type = 1");
  });
  it("returns a condition based on the number of passengers", () => {
    const result = buildWhere({ ...DEFAULT_FILTERS, passengerNumber: 4 });
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

describe('countActiveFilters', () => {
 it('returns 0 when there are no filters applied', () => {
  const result = countActiveFilters({...DEFAULT_FILTERS})
  expect(result).toBe(0)
 })
  it('returns the numbers of filters applied', () => {
  const result = countActiveFilters({...DEFAULT_FILTERS, fareAmount: 45, passengerNumber: 3, paymentType: 2})
  expect(result).toBe(3)
 })
 it('returns 1 when only the min of milesDistance has been changed ', () => {
  const result = countActiveFilters({...DEFAULT_FILTERS, milesDistance: [15,500]})
  expect(result).toBe(1)
 })
 it('returns 1 when the hideNegativeFare filter is applied', () => {
  const result = countActiveFilters({...DEFAULT_FILTERS, hideNegativeFare: true})
  expect(result).toBe(1)
 })
})
