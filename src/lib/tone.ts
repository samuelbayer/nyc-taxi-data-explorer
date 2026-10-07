import { formatTypePayment } from "./format";

export function moneyTone(cents: number): string {
  if (cents < 0) return " text-loss";
  if (cents === 0) return " text-muted";
  return "";
}

export function paymentTone(paymentType: number): string {
  const formattedPaymentType = formatTypePayment(paymentType);
  if (formattedPaymentType === "No charge") return "text-caution";
  if (formattedPaymentType === "Dispute") return "text-caution";
  if (formattedPaymentType === "Voided trip") return "text-caution";
  return "";
}
