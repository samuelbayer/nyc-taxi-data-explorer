import { TRIP_COLUMNS } from "../lib/columns";
import type { TaxiTrip } from "../types";
import { useI18n } from "../i18n/context";
export const CARD_HEIGHT = 360;

export function TripCard({ trip }: { trip: TaxiTrip }) {
  const { t } = useI18n();
  return (
    <div className="xl:hidden px-2 py-3" style={{ height: CARD_HEIGHT }}>
      <div className="h-full bg-surface rounded-lg grid-cols-2 grid gap-6 p-4 border border-rule">
        {TRIP_COLUMNS.map((col) => {
          return (
            <div key={col.key}>
              <p className="text-sm text-muted">{t.columns[col.key]}</p>
              <p className={col.muted ? "text-muted" : ""} key={col.key}>
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
