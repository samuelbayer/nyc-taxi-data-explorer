import { TripsTable } from "./components/TripsTable";
import { useState } from "react";
import { countActiveFilters, DEFAULT_FILTERS } from "./lib/filters.ts";
import useDebounce from "./hooks/useDebounce.ts";
import { FiltersPanel } from "./components/FiltersPanel.tsx";
import type { Filters } from "./types.ts";

function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersDebounced = useDebounce(filters, 300);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isFullFileReady, setIsFullFileReady] = useState(false);
  const activeFilters = countActiveFilters(filters);
  return (
    <>
      <div className="min-h-screen md:h-dvh flex flex-col bg-slate-950 px-6 py-3 text-white">
        <h1 className="xl:text-4xl text-3xl font-bold mb-2 md:mb-8">
          NYC Taxi Data Explorer
        </h1>
        <div className="flex justify-end mb-2 md:hidden">
          <button
            aria-expanded={filtersOpen}
            aria-controls="filters-panel"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`${filtersOpen ? "bg-slate-800" : "bg-slate-900"}  border border-slate-700 text-slate-300 px-2 py-1 rounded text-sm flex gap-1 items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M6.5 2.25a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0V4.5h6.75a.75.75 0 0 0 0-1.5H6.5v-.75ZM11 6.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-.75h2.25a.75.75 0 0 0 0-1.5H11V6.5ZM5.75 10a.75.75 0 0 1 .75.75v.75h6.75a.75.75 0 0 1 0 1.5H6.5v.75a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM2.75 7.25H8.5v1.5H2.75a.75.75 0 0 1 0-1.5ZM4 3H2.75a.75.75 0 0 0 0 1.5H4V3ZM2.75 11.5H4V13H2.75a.75.75 0 0 1 0-1.5Z" />
            </svg>
            Filters {activeFilters > 0 && <span>({activeFilters})</span>}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:flex-1 md:min-h-0">
          <aside
            id="filters-panel"
            className={`${filtersOpen ? "" : "hidden"} w-full shrink-0 md:w-72 md:block`}
          >
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
