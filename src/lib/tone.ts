import { formatTypePayment } from "./format"

export function moneyTone(cents: number): string {
if (cents < 0) return ' text-red-400'
if (cents === 0) return ' text-slate-500'
return ''
}

export function paymentTone(paymentType: number): string {
  const formattedPaymentType = formatTypePayment(paymentType)
  if (formattedPaymentType === 'No charge') return 'text-amber-400'
  if (formattedPaymentType === 'Dispute')  return 'text-amber-400'
  if (formattedPaymentType === 'Voided trip')  return 'text-amber-400'
  return ''
}