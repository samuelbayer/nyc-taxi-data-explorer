import { TripsTable } from "./components/TripsTable";
import { useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from "./lib/filters.ts";
import useDebounce from "./hooks/useDebounce.tsx";
import { FiltersPanel } from "./components/FiltersPanel.tsx";
import type { Filters } from "./types.ts";
import { I18nProvider } from "./i18n/i18n.tsx";
import { useI18n } from "./i18n/context.ts";
import { LANGUAGES, LANGUAGE_NAMES, isLang } from "./i18n/messages.ts";
import { ThemeProvider } from "./theme.tsx";
import { useTheme } from "./themeContext.ts";

const CONTROL =
  "rounded-md border border-rule bg-surface px-3 py-1.5 text-sm text-ink";

function HeaderControls() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label={t.language}
        value={lang}
        onChange={(e) => isLang(e.target.value) && setLang(e.target.value)}
        className={CONTROL}
      >
        {LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_NAMES[code]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={toggle}
        className={`${CONTROL} cursor-pointer`}
      >
        {theme === "dark" ? t.theme.toLight : t.theme.toDark}
      </button>
    </div>
  );
}

function Shell() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ink = dark ? "#e8ecea" : "#181c20";
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
          colorPrimary: ink,
          fontFamily: '"Overpass", system-ui, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          Slider: {
            trackBg: ink,
            trackHoverBg: ink,
            handleColor: ink,
            handleActiveColor: ink,
            railBg: dark ? "#2c353a" : "#cbd2d0",
            railHoverBg: dark ? "#3a454b" : "#b7c0be",
          },
        },
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <div className="min-h-screen px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              NYC Taxi Data Explorer
            </h1>
            <p className="mt-1 text-muted">{t.subtitle}</p>
          </div>
          <HeaderControls />
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

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Shell />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
