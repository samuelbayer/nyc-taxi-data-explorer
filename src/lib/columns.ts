import type { TaxiTrip } from "../types";
import {
  formatDistance,
  formatMoney,
  formatDateTime,
  formatDuration,
  formatDropOffDate,
  formatTypePayment,
  formatPassengerNumber,
} from "./format";
import { moneyTone, paymentTone } from "./tone";
import type { ColumnKey } from "../i18n/messages";

type Column = {
  key: ColumnKey;
  align: "left" | "right";
  width: number;
  muted?: boolean;
  tone?: (trip: TaxiTrip) => string;
  render: (trip: TaxiTrip) => string;
};

export const ALIGN_CLASS = {
  left: "text-left",
  right: "text-right tabular-nums",
} as const;

export const JUSTIFY_CLASS = {
  left: "justify-start",
  right: "justify-end",
} as const;

export const TRIP_COLUMNS: Column[] = [
  {
    key: "distance",
    align: "right",
    width: 1,
    muted: false,
    render: (trip) => formatDistance(trip.distance_cent),
  },
  {
    key: "fare",
    align: "right",
    width: 1,
    muted: false,
    tone: (trip) => moneyTone(trip.fare_cents),
    render: (trip) => formatMoney(trip.fare_cents),
  },
  {
    key: "tip",
    align: "right",
    width: 1,
    muted: false,
    tone: (trip) => moneyTone(trip.tip_cents),
    render: (trip) => formatMoney(trip.tip_cents),
  },
  {
    key: "duration",
    align: "right",
    width: 1.1,
    muted: false,
    render: (trip) => formatDuration(trip.duration_s),
  },
  {
    key: "pickup",
    align: "left",
    width: 2.2,
    muted: true,
    render: (trip) => formatDateTime(trip.pickup),
  },
  {
    key: "dropoff",
    align: "left",
    width: 2.2,
    muted: true,
    render: (trip) => formatDropOffDate(trip.pickup, trip.duration_s),
  },
  {
    key: "passengers",
    align: "right",
    muted: true,
    width: 1.2,
    render: (trip) => formatPassengerNumber(trip.passengers),
  },
  {
    key: "payment",
    align: "left",
    muted: true,
    width: 2,
    tone: (trip) => paymentTone(trip.payment_type),
    render: (trip) => formatTypePayment(trip.payment_type),
  },
];

const widths = TRIP_COLUMNS.map((col) => `minmax(0, ${col.width}fr)`).join(" ");
export const TRIP_GRID_STYLE = {
  gridTemplateColumns: widths,
};

export function cellClass(col: Column) {
  return (
    ALIGN_CLASS[col.align] +
    // Text can be cut with an ellipsis; numbers must never be.
    (col.align === "left" ? " truncate" : " whitespace-nowrap") +
    (col.muted ? " text-muted" : "")
  );
}
