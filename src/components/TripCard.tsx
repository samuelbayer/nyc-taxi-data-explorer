import { TRIP_COLUMNS } from "../lib/columns";
import type { TaxiTrip } from "../types";
export const CARD_HEIGHT = 360;

export function TripCard({ trip }: { trip: TaxiTrip }) {
  return (
    <div
      className="xl:hidden px-2 py-3"
      style={{ height: CARD_HEIGHT }}
    >
      <div className='h-full bg-slate-900 rounded-xl grid-cols-2 grid gap-6 p-4 border border-slate-800'>
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
    </div>
  );
}
