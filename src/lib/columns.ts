import type { TaxiTrip } from "../types"
import {formatDistance,formatMoney,formatDateTime, formatDuration, formatDropOffDate, formatTypePayment} from "./format"

type Column = {
  key: string,
  label: string,
  align: 'left' | 'right',
  render: (trip: TaxiTrip) => string
}



export const TRIP_COLUMNS: Column[] = [
  {
    key: 'distance', 
    label: 'Distance', 
    align: 'right', 
    render: (trip) => formatDistance(trip.distance_cent)
  },
  {
    key: 'fare', 
    label: 'Fare', 
    align: 'right', 
    render: (trip) => formatMoney((trip.fare_cents))
  },
  {
    key: 'tip', 
    label: 'Tip', 
    align: 'right', 
    render: (trip) => formatMoney((trip.tip_cents))
  },
  {
    key: 'duration', 
    label: 'Duration', 
    align: 'right', 
    render: (trip) => formatDuration(trip.duration_s)
  },
  {
    key: 'pickup', 
    label: 'Pickup', 
    align: 'left', 
    render: (trip) =>  formatDateTime(trip.pickup)
  },
  {
    key: 'dropoff', 
    label: 'Dropoff', 
    align: 'left', 
    render: (trip) => formatDropOffDate(trip.pickup, trip.duration_s) 
  },
  {
    key: 'passengers', 
    label: 'Passengers', 
    align: 'right', 
    render: (trip) => String(trip.passengers)
  },
  {
    key: 'payment', 
    label: 'Payment', 
    align: 'left', 
    render: (trip) => formatTypePayment(trip.payment_type)
  }
]