import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import useParquetQuery from "../hooks/useParquetQuery.tsx";
import { RowSkeleton } from "./RowSkeleton.tsx";
import { TRIP_COLUMNS } from "../lib/columns.ts";
import { ALIGN_CLASS } from "../lib/columns.ts";
import { TRIP_GRID_STYLE } from "../lib/columns.ts";
import type { Filters } from "../types.ts";
import { StatusBar } from "./StatusBar.tsx";
import { CARD_HEIGHT, TripCard } from "./TripCard.tsx";
import { TripRow } from "./TripRow.tsx";
import { VirtualRow } from "./VirtualRow.tsx";

const BLOCK_SIZE = 500;
// Must match Tailwind's `xl` breakpoint (80rem = 1280px), used by the row/card classes.
// Below it the 8-column grid no longer fits next to the filters panel.
export const MOBILE_BREAKPOINT = 1280;

type Props = { filtersDebounced: Filters, setDownloadProgress: React.Dispatch<React.SetStateAction<number | null>>, setIsFullFileReady: React.Dispatch<React.SetStateAction<boolean>> };

export const TripsTable: React.FC<Props> = ({ filtersDebounced, setDownloadProgress, setIsFullFileReady }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevFilters, setPrevFilters] = useState(filtersDebounced);
  const { error, loading, trips, totalCount, setIndexRange, queryMs, phase } =
    useParquetQuery(filtersDebounced, setDownloadProgress, setIsFullFileReady);

  if (filtersDebounced !== prevFilters) {
    setPrevFilters(filtersDebounced);
    setIndexRange([0, BLOCK_SIZE - 1]);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filtersDebounced]);

  const virtualizer = useVirtualizer({
    count: totalCount,
    estimateSize: () =>
      window.innerWidth < MOBILE_BREAKPOINT ? CARD_HEIGHT : 44,
    getScrollElement: () => scrollRef.current,
    overscan: 10,
  });

  useEffect(() => {
    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT === isMobile) {
        return;
      }
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      return virtualizer.measure();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  const firstIndex = virtualItems[0]?.index ?? 0;
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  useEffect(() => {
    if (virtualItems.length === 0) return;

    const start = Math.floor(firstIndex / BLOCK_SIZE) * BLOCK_SIZE;
    const end = Math.ceil((lastIndex + 1) / BLOCK_SIZE) * BLOCK_SIZE - 1;

    const handler = setTimeout(() => {
      setIndexRange((prev) => {
        const [prevMin, prevMax] = prev;
        if (prevMin === start && prevMax === end) return prev;
        return [start, end];
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [firstIndex, lastIndex, virtualItems.length, setIndexRange]);

  return (
    <>
      <StatusBar
        totalCount={totalCount}
        firstIndex={firstIndex}
        lastIndex={lastIndex}
        queryMs={queryMs}
        error={error}
        loading={loading}
        tripsArrLength={trips.tripsArr.length}
        phase={phase}
      />
      <div
        ref={scrollRef}
        className="h-[85dvh] w-full mx-auto overflow-auto [scrollbar-gutter:stable]"
      >
        <div
          style={TRIP_GRID_STYLE}
          className="hidden will-change-transform text-xs uppercase tracking-wide text-slate-400 border-b border-slate-700 bg-slate-950 z-10 sticky top-0 xl:grid gap-4 2xl:gap-8 px-3 xl:px-4 py-4"
        >
          {TRIP_COLUMNS.map((col) => (
            <div className={ALIGN_CLASS[col.align]} key={col.key}>
              {col.label}
            </div>
          ))}
        </div>
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {loading && totalCount === 0
            ? Array.from({ length: 23 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height:
                    window.innerWidth < MOBILE_BREAKPOINT ? CARD_HEIGHT : 44,
                }}
                className="xl:border-b border-slate-900"
              >
                <RowSkeleton index={i} />
              </div>
            ))
            : null}
          {!error &&
            virtualItems.map((vItem) => {
              const trip = trips.tripsArr[vItem.index - trips.range[0]];

              if (!trip) {
                return (
                  <VirtualRow key={vItem.key} vItem={vItem}>
                    <RowSkeleton index={vItem.index} />
                  </VirtualRow>
                );
              }

              return (
                <VirtualRow
                  key={vItem.key}
                  vItem={vItem}
                  className={
                    vItem.index % 2 === 1
                      ? "xl:bg-slate-900/40"
                      : "xl:bg-slate-900/20"
                  }
                >
                  <TripRow trip={trip} />
                  <TripCard trip={trip} />
                </VirtualRow>
              );
            })}
        </div>
      </div>
    </>
  );
};
