import { TripsTable } from "./components/TripsTable";
import { useState } from "react";
import { ConfigProvider } from "antd";
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#181c20",
          fontFamily: '"Overpass", system-ui, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <div className="min-h-screen px-4 py-6 md:px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            NYC Taxi Data Explorer
          </h1>
          <p className="mt-1 text-muted">
            Every taxi trip from January 2026. Filters run in your browser.
          </p>
        </header>
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full shrink-0 md:w-72">
            <FiltersPanel filters={filters} setFilters={setFilters} />
          </aside>
          <main className="min-w-0 flex-1">
            <TripsTable filtersDebounced={filtersDebounced} />
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
