import { TripsTable } from "./components/TripsTable";
import { useState } from "react";
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from "./lib/filters.ts";
import useDebounce from "./hooks/useDebounce.tsx";
import { FiltersPanel } from "./components/FiltersPanel.tsx";
import type { Filters } from "./types.ts";

function App() {
  const [filters, setFilters] = useState<Filters>({
    fareAmount: 0,
    milesDistance: [0, MAX_MILES_DISTANCE],
    paymentType: ALL_PAYMENT_TYPES,
    passengerNumber: 0,
    hideNegativeFare: false,
  });
  const filtersDebounced = useDebounce(filters, 300);

  return (
    <>
      <div className="min-h-screen bg-slate-950 px-6 py-3 text-white">
        <h1 className="text-4xl font-bold mb-8">NYC Taxi Data Explorer</h1>
        <div className="flex flex-col md:flex-row gap-6 ">
          <aside className="w-full shrink-0 md:w-72">
            <FiltersPanel filters={filters} setFilters={setFilters} />
          </aside>
          <main className="flex-1 min-w-0">
            <TripsTable filtersDebounced={filtersDebounced} />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
