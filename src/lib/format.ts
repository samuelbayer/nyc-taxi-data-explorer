import { LOCALES, MESSAGES, type Lang } from "../i18n/messages";

function build(lang: Lang) {
  const locale = LOCALES[lang];
  return {
    money: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    }),
    miles: new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "mile",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    integer: new Intl.NumberFormat(locale),
    // Numeric dates keep rows short where month names are long ("1 de jan. de 2026").
    dateTime: new Intl.DateTimeFormat(
      locale,
      lang === "en"
        ? { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }
        : {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          },
    ),
  };
}

let currentLang: Lang = "en";
let formats = build(currentLang);

/** Switches the language used by every formatter below. */
export function setFormatLang(lang: Lang) {
  currentLang = lang;
  formats = build(lang);
}

export function formatDistance(hundredthsOfMile: number): string {
  return formats.miles.format(hundredthsOfMile / 100);
}

export function formatMoney(cents: number): string {
  return formats.money.format(cents / 100);
}

export function formatInteger(number: number): string {
  return formats.integer.format(number);
}

export function formatDateTime(time: number): string {
  return formats.dateTime.format(time);
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
  const messages = MESSAGES[currentLang];
  if (type === null) return messages.paymentUnknown;
  return messages.payment[type] ?? messages.paymentUnknown;
}

export function formatPassengerNumber(passengers: number): string {
  if (passengers === null) return "—";
  const stringified = String(passengers);
  return stringified;
}
