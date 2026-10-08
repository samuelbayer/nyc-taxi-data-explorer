import type { Filters } from "../types";

export const ALL_PAYMENT_TYPES = 7;
export const MAX_MILES_DISTANCE = 500;

export function buildWhere(filters: Filters): string {
  const [min, max] = filters.milesDistance;
  const fareAmount =
    filters.fareAmount > 0 ? `fare_cents >= ${filters.fareAmount * 100}` : "";
  const hideNegativeFareAmount = filters.hideNegativeFare
    ? "fare_cents >= 0"
    : "";
  const milesDistanceConditionMin =
    min > 0 ? `distance_cent >= ${min * 100}` : "";
  const milesDistanceConditionMax =
    max < MAX_MILES_DISTANCE ? `distance_cent <= ${max * 100}` : "";

  const paymentTypeCondition =
    filters.paymentType === ALL_PAYMENT_TYPES
      ? ""
      : `payment_type = ${filters.paymentType}`;
  const amountPassengerCondition =
    filters.passengerNumber > 0
      ? `passengers >= ${filters.passengerNumber}`
      : "";

  const cond: string[] = [
    milesDistanceConditionMin,
    milesDistanceConditionMax,
    fareAmount,
    paymentTypeCondition,
    amountPassengerCondition,
    hideNegativeFareAmount,
  ];
  const condFiltered = cond.filter((cond) => cond !== "");
  return condFiltered.length ? `WHERE ${condFiltered.join(" AND ")}` : "";
}
