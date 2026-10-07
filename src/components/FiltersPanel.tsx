import { type Filters } from "../types";
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from "../lib/filters";
import { Slider } from "antd";
import { useI18n } from "../i18n/context";

const LABEL = "flex items-baseline justify-between gap-2 text-sm font-semibold";
const VALUE = "font-normal text-muted";

export function FiltersPanel({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-6 rounded-md border border-rule bg-paper p-4 text-left">
      <div className="flex items-center gap-2">
        <input
          id="hide-negative-amounts"
          type="checkbox"
          className="size-4 accent-ink"
          checked={filters.hideNegativeFare}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              hideNegativeFare: e.target.checked,
            }))
          }
        ></input>
        <label
          className="text-sm font-semibold"
          htmlFor="hide-negative-amounts"
        >
          {t.filters.hideNegative}
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL} htmlFor="payment-range">
          {t.filters.minFare}
          <span className={VALUE}>${filters.fareAmount}</span>
        </label>
        <input
          type="range"
          id="payment-range"
          min="0"
          max="1000"
          step="1"
          value={filters.fareAmount}
          className="w-full accent-ink"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              fareAmount: Number(e.target.value),
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="type-payment">
          {t.filters.paymentType}
        </label>
        <select
          id="type-payment"
          value={filters.paymentType}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              paymentType: Number(e.target.value),
            }))
          }
          className="rounded-md border border-rule bg-surface px-2 py-2 text-ink"
        >
          <option value={ALL_PAYMENT_TYPES}>{t.filters.noFilter}</option>
          {t.payment.map((label, type) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL} htmlFor="number-passengers">
          {t.filters.minPassengers}
          <span className={VALUE}>
            {filters.passengerNumber === 0
              ? t.filters.any
              : filters.passengerNumber}
          </span>
        </label>
        <input
          type="range"
          id="number-passengers"
          min="0"
          max="9"
          step="1"
          value={filters.passengerNumber}
          className="w-full accent-ink"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              passengerNumber: Number(e.target.value),
            }))
          }
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL} htmlFor="miles-range">
          {t.filters.distance}
          <span className={VALUE}>
            {t.filters.distanceRange(
              filters.milesDistance[0],
              filters.milesDistance[1] === MAX_MILES_DISTANCE
                ? `${filters.milesDistance[1]}+`
                : String(filters.milesDistance[1]),
            )}
          </span>
        </label>
        <Slider
          range
          id="miles-range"
          value={filters.milesDistance}
          onChange={(valor) =>
            setFilters((prev) => ({ ...prev, milesDistance: valor }))
          }
          max={MAX_MILES_DISTANCE}
          ariaLabelForHandle={[
            t.filters.minDistanceHandle,
            t.filters.maxDistanceHandle,
          ]}
        />
      </div>
    </div>
  );
}
