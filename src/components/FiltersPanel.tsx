import { type Filters } from "../types";
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from "../lib/filters";
import { Slider } from "antd";

const LABEL = "flex items-baseline justify-between gap-2 text-sm font-semibold";
const VALUE = "font-normal text-muted";

export function FiltersPanel({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
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
        <label className="text-sm font-semibold" htmlFor="hide-negative-amounts">
          Hide negative fares
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL} htmlFor="payment-range">
          Min. fare
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
          Payment type
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
          className="rounded-md border border-rule bg-white px-2 py-2 text-ink"
        >
          <option value={ALL_PAYMENT_TYPES}>No Filter</option>
          <option value="0">Flex Fare trip</option>
          <option value="1">Credit card</option>
          <option value="2">Cash</option>
          <option value="3">No charge</option>
          <option value="4">Dispute</option>
          <option value="5">Unknown</option>
          <option value="6">Voided trip</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL} htmlFor="number-passengers">
          Min. passengers
          <span className={VALUE}>
            {filters.passengerNumber === 0 ? "Any" : filters.passengerNumber}
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
          Distance
          <span className={VALUE}>
            {filters.milesDistance[0]} to{" "}
            {filters.milesDistance[1] === MAX_MILES_DISTANCE
              ? `${filters.milesDistance[1]}+`
              : filters.milesDistance[1]}{" "}
            mi
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
          ariaLabelForHandle={["Minimum distance", "Maximum distance"]}
        />
      </div>
    </div>
  );
}
