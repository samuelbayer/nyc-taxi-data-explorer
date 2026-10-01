import { TRIP_COLUMNS } from "../lib/columns";
import type { TaxiTrip } from "../types";
export const CARD_HEIGHT = 360;

export function TripCard({ trip }: { trip: TaxiTrip }) {
  return (
    <div
      className="md:hidden grid gap-8 p-6 grid-cols-2"
      style={{ height: CARD_HEIGHT }}
    >
      {TRIP_COLUMNS.map((col) => {
        return (
          <div key={col.key}>
            <p className="text-xs uppercase tracking-wide text-slate-400  ">
              {col.label}
            </p>
            <p className={col.muted ? " text-slate-400" : ""} key={col.key}>
              <span className={col.tone ? col.tone(trip) : ""}>
                {col.render(trip)}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
