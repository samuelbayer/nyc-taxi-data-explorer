import { TripsTable } from "./components/TripsTable";
import { useState } from "react";
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from "./lib/filters.ts";
import useDebounce from "./hooks/useDebounce.ts";
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersDebounced = useDebounce(filters, 300);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isFullFileReady, setIsFullFileReady] = useState(false);

  return (
    <>
      <div className="min-h-screen md:h-dvh flex flex-col bg-slate-950 px-6 py-3 text-white">
        <h1 className="xl:text-4xl text-3xl font-bold mb-8">NYC Taxi Data Explorer</h1>
        <div className="flex mb-2 md:hidden">
          <button aria-expanded={filtersOpen} aria-controls="filters-panel" onClick={() => setFiltersOpen(!filtersOpen)} className="bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded">{filtersOpen ? 'Hide filters' : 'Show filters'}</button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:flex-1 md:min-h-0">
          <aside id='filters-panel' className={`${filtersOpen ? '' : 'hidden'} w-full shrink-0 md:w-72 md:block`}>
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              downloadProgress={downloadProgress}
              isFullFileReady={isFullFileReady}
            />
          </aside>
          <main className="flex-1 min-w-0 md:h-full">
            <TripsTable
              filtersDebounced={filtersDebounced}
              setDownloadProgress={setDownloadProgress}
              setIsFullFileReady={setIsFullFileReady}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
