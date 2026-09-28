import type { TaxiTrip } from "../types"
import {formatDistance,formatMoney,formatDateTime, formatDuration, formatDropOffDate, formatTypePayment, formatPassengerNumber} from "./format"

type Column = {
  key: string,
  label: string,
  align: 'left' | 'right',
  width: number,
  muted?: boolean,
  render: (trip: TaxiTrip) => string
}

export const ALIGN_CLASS = {
  left: 'text-left',
  right: 'text-right tabular-nums',
} as const


export const TRIP_COLUMNS: Column[] = [
  {
    key: 'distance', 
    label: 'Distance', 
    align: 'right', 
    width: 1,
    muted: false,
    render: (trip) => formatDistance(trip.distance_cent)
  },
  {
    key: 'fare', 
    label: 'Fare', 
    align: 'right',
    width: 1,
    muted: false,
    render: (trip) => formatMoney((trip.fare_cents))
  },
  {
    key: 'tip', 
    label: 'Tip', 
    align: 'right', 
    width: 1,
    muted: false,
    render: (trip) => formatMoney((trip.tip_cents))
  },
  {
    key: 'duration', 
    label: 'Duration', 
    align: 'right',
    width: 1.2,
    muted: false,
    render: (trip) => formatDuration(trip.duration_s)
  },
  {
    key: 'pickup', 
    label: 'Pickup', 
    align: 'left', 
    width: 2,
    muted: true,
    render: (trip) =>  formatDateTime(trip.pickup)
  },
  {
    key: 'dropoff', 
    label: 'Dropoff', 
    align: 'left', 
    width: 2,
    muted: true,
    render: (trip) => formatDropOffDate(trip.pickup, trip.duration_s) 
  },
  {
    key: 'passengers', 
    label: 'Passengers', 
    align: 'right',
    muted: true,
    width: 0.8, 
    render: (trip) => formatPassengerNumber(trip.passengers)
  },
  {
    key: 'payment', 
    label: 'Payment', 
    align: 'left', 
    muted: true,
    width: 1.5,
    render: (trip) => formatTypePayment(trip.payment_type)
  }
]

const widths = TRIP_COLUMNS.map(col => `minmax(0, ${col.width}fr)`).join(' ')
export const TRIP_GRID_STYLE = {
  gridTemplateColumns: widths,
}