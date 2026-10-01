import { describe, it, expect } from "vitest";
import {
  ALL_PAYMENT_TYPES,
  construirWhere,
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

describe("construirWhere", () => {
  it("returns an empty string with default filters", () => {
    const resultado = construirWhere(testFilter);
    expect(resultado).toBe("");
  });
  it("returns a minimum fare condition", () => {
    const resultado = construirWhere({ ...testFilter, fareAmount: 50 });
    expect(resultado).toBe("WHERE fare_cents >= 5000");
  });
  it("returns a condition to hide negative amounts", () => {
    const resultado = construirWhere({ ...testFilter, hideNegativeFare: true });
    expect(resultado).toBe("WHERE fare_cents >= 0");
  });
  it("returns a minimum miles distance condition with min and max", () => {
    const resultado = construirWhere({
      ...testFilter,
      milesDistance: [15, 450],
    });
    expect(resultado).toBe(
      "WHERE distance_cent >= 1500 AND distance_cent <= 45000",
    );
  });
  it("returns a minimum miles condition with only min", () => {
    const resultado = construirWhere({
      ...testFilter,
      milesDistance: [30, MAX_MILES_DISTANCE],
    });
    expect(resultado).toBe("WHERE distance_cent >= 3000");
  });
  it("returns a minimum miles condition with only max", () => {
    const resultado = construirWhere({
      ...testFilter,
      milesDistance: [0, 120],
    });
    expect(resultado).toBe("WHERE distance_cent <= 12000");
  });
  it("returns a payment type condition", () => {
    const resultado = construirWhere({ ...testFilter, paymentType: 1 });
    expect(resultado).toBe("WHERE payment_type = 1");
  });
  it("returns a condition based on the number of passengers", () => {
    const resultado = construirWhere({ ...testFilter, passengerNumber: 4 });
    expect(resultado).toBe("WHERE passengers >= 4");
  });
  it("returns a string with all the conditions", () => {
    const resultado = construirWhere({
      fareAmount: 15,
      milesDistance: [20, 300],
      paymentType: 4,
      passengerNumber: 3,
      hideNegativeFare: true,
    });
    expect(resultado).toBe(
      "WHERE distance_cent >= 2000 AND distance_cent <= 30000 AND fare_cents >= 1500 AND payment_type = 4 AND passengers >= 3 AND fare_cents >= 0",
    );
  });
});
