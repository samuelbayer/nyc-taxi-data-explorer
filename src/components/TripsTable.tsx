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
import { Pagination } from "./Pagination.tsx";
import { useBreakpointMeasure } from "../hooks/useBreakpointMeasure.ts";
import { MOBILE_BREAKPOINT } from "../lib/breakpoints";
import { BLOCK_SIZE } from "../lib/blockSize.ts";
import { useBlockRange } from "../hooks/useBlockRange.ts";


export const PAGE_SIZE = 50000;

type Props = {
  filtersDebounced: Filters;
  setDownloadProgress: React.Dispatch<React.SetStateAction<number | null>>;
  setIsFullFileReady: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TripsTable: React.FC<Props> = ({
  filtersDebounced,
  setDownloadProgress,
  setIsFullFileReady,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevFilters, setPrevFilters] = useState(filtersDebounced);
  const [page, setPage] = useState(0);
  const { error, loading, trips, totalCount, setIndexRange, queryMs, phase } =
    useParquetQuery(filtersDebounced, setDownloadProgress, setIsFullFileReady);
  const pageStart = page * PAGE_SIZE;
  const pageRowCount = Math.max(0, Math.min(PAGE_SIZE, totalCount - pageStart));

  if (filtersDebounced !== prevFilters) {
    setPrevFilters(filtersDebounced);
    setIndexRange([0, BLOCK_SIZE - 1]);
    setPage(0)
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filtersDebounced]);

  const virtualizer = useVirtualizer({
    count: pageRowCount,
    estimateSize: () =>
      window.innerWidth < MOBILE_BREAKPOINT ? CARD_HEIGHT : 44,
    getScrollElement: () => scrollRef.current,
    overscan: 10,
  });

  useBreakpointMeasure(virtualizer)

  const virtualItems = virtualizer.getVirtualItems();

  const firstIndex = virtualItems[0]?.index ?? 0;
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  useBlockRange({ visibleCount: virtualItems.length, setIndexRange, pageStart, firstIndex, lastIndex });

  const onPageChange = (newPage: number) => {
    setPage(newPage)
    scrollRef.current?.scrollTo({ top: 0 })
    setIndexRange([newPage * PAGE_SIZE, newPage * PAGE_SIZE + BLOCK_SIZE - 1])
  }
  const pageCount = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="flex flex-col md:h-full">
      <div className="order-1 m-1 md:m-0">
        <StatusBar
          totalCount={totalCount}
          firstIndex={firstIndex}
          lastIndex={lastIndex}
          queryMs={queryMs}
          error={error}
          loading={loading}
          tripsArrLength={trips.tripsArr.length}
          phase={phase}
          pageStart={pageStart}
        />
      </div>
      <div
        aria-busy={loading}
        aria-label="NYC taxi trips"
        role='table'
        aria-rowcount={totalCount + 1}
        ref={scrollRef}
        className="h-[85dvh] md:h-auto md:flex-1 md:min-h-0 w-full mx-auto overflow-auto [scrollbar-gutter:stable] order-3"
      >
        <div
          aria-rowindex={1}
          role="row"
          style={TRIP_GRID_STYLE}
          className="hidden will-change-transform text-xs uppercase tracking-wide text-slate-400 border-b border-slate-700 bg-slate-950 z-10 sticky top-0 xl:grid gap-4 2xl:gap-8 px-3 xl:px-4 py-4"
        >
          {TRIP_COLUMNS.map((col) => (
            <div role='columnheader' className={ALIGN_CLASS[col.align]} key={col.key}>
              {col.label}
            </div>
          ))}
        </div>
        <div
          role="rowgroup"
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
              const trip = trips.tripsArr[(vItem.index + pageStart) - trips.range[0]];
              if (!trip) {
                return (
                  <VirtualRow pageStart={pageStart} key={vItem.key} vItem={vItem}>
                    <RowSkeleton index={vItem.index} />
                  </VirtualRow>
                );
              }

              return (
                <VirtualRow
                  pageStart={pageStart}
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
      <div className="h-14 order-2 xl:order-4 border-b xl:border-b-0 xl:border-t flex flex-col justify-center border-slate-700">
        {pageCount > 1 && <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />}
      </div>
    </div>
  );
};
