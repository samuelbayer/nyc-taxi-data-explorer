import { cellClass, TRIP_COLUMNS, TRIP_GRID_STYLE } from "../lib/columns";
import type { TaxiTrip } from "../types";

export function TripRow({ trip }: { trip: TaxiTrip }) {
  return (
    <div
      style={TRIP_GRID_STYLE}
      className="hidden w-full items-center p-3 text-sm xl:py-2 xl:px-4 xl:grid gap-4 2xl:gap-8"
    >
      {TRIP_COLUMNS.map((col) => (
        <p className={cellClass(col)} key={col.key} title={col.render(trip)}>
          <span className={col.tone ? col.tone(trip) : ""}>
            {col.render(trip)}
          </span>
        </p>
      ))}
    </div>
  );
}
