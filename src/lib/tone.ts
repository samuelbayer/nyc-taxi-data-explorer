export function moneyTone(cents: number): string {
  if (cents < 0) return " text-loss";
  if (cents === 0) return " text-muted";
  return "";
}

// Payment types 3, 4 and 6: no charge, dispute, voided trip.
const FLAGGED_PAYMENT_TYPES = [3, 4, 6];

export function paymentTone(paymentType: number): string {
  return FLAGGED_PAYMENT_TYPES.includes(paymentType) ? "text-caution" : "";
}
