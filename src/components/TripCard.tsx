import { cellClass, TRIP_COLUMNS } from "../lib/columns";
import type { TaxiTrip } from "../types";

export function TripCard({ trip }: { trip: TaxiTrip }) {

  return (
    <div className="md:hidden md:grid grid-cols-2">
      {TRIP_COLUMNS.map(col => {
        return <div key={col.key}>
          <p>{col.label}</p>
          <p className={cellClass(col)} key={col.key}><span className={col.tone ? col.tone(trip) : ''}>{col.render(trip)}</span></p>
        </div>
      })}


    </div>
  )
}
