const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const miles = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "mile",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("en-US");

const dateTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatDistance(hundredthsOfMile: number): string {
  return miles.format(hundredthsOfMile / 100);
}

export function formatMoney(cents: number): string {
  return money.format(cents / 100);
}

export function formatInteger(number: number): string {
  return integer.format(number);
}

export function formatDateTime(time: number): string {
  return dateTime.format(time);
}

export function formatDropOffDate(pickup: number, duration: number): string {
  return formatDateTime(pickup + duration * 1000);
}

export function formatDuration(duration: number): string {
  const hour = Math.floor(duration / 60 / 60);
  const min = Math.floor((duration % 3600) / 60);
  return hour < 1 ? `${min} min` : `${hour} h ${min} min`;
}

export function formatTypePayment(type: number | null): string {
  if (type === 0) return "Flex Fare trip";
  if (type === 1) return "Credit card";
  if (type === 2) return "Cash";
  if (type === 3) return "No charge";
  if (type === 4) return "Dispute";
  if (type === 5) return "Unknown";
  if (type === 6) return "Voided trip";
  return "N/A";
}

export function formatPassengerNumber(passengers: number): string {
  if (passengers === null) return "—";
  const stringified = String(passengers);
  return stringified;
}
