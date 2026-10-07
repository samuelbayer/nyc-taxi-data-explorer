import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { useI18n } from "../i18n/context";

const BLOQUE = 500;
// Must match Tailwind's `xl` breakpoint (80rem = 1280px), used by the row/card classes.
// Below it the 8-column grid no longer fits next to the filters panel.
export const MOBILE_BREAKPOINT = 1280;

type Props = {
  filtersDebounced: Filters;
  /** Element in the page header where the meter readout is rendered. */
  statusSlot: HTMLElement | null;
};

export const TripsTable: React.FC<Props> = ({
  filtersDebounced,
  statusSlot,
}) => {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevFilters, setPrevFilters] = useState(filtersDebounced);
  const {
    error,
    loading,
    trips,
    totalCount,
    setIndexRange,
    tiempoTotal,
    phase,
  } = useParquetQuery(filtersDebounced);

  if (filtersDebounced !== prevFilters) {
    setPrevFilters(filtersDebounced);
    setIndexRange([0, BLOQUE - 1]);
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
    let isItMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT === isItMobile) {
        return;
      }
      isItMobile = window.innerWidth < MOBILE_BREAKPOINT;
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

    const start = Math.floor(firstIndex / BLOQUE) * BLOQUE;
    const end = Math.ceil((lastIndex + 1) / BLOQUE) * BLOQUE - 1;

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
      {statusSlot &&
        createPortal(
          <StatusBar
            totalCount={totalCount}
            firstIndex={firstIndex}
            lastIndex={lastIndex}
            tiempoTotal={tiempoTotal}
            error={error}
            loading={loading}
            tripsArrLength={trips.tripsArr.length}
            phase={phase}
          />,
          statusSlot,
        )}
      <div
        ref={scrollRef}
        className="mx-auto h-[85dvh] w-full overflow-auto rounded-lg border border-rule bg-paper [scrollbar-gutter:stable]"
      >
        <div
          style={TRIP_GRID_STYLE}
          className="hidden will-change-transform whitespace-nowrap text-sm font-semibold text-muted border-b border-rule bg-paper z-10 sticky top-0 xl:grid gap-4 2xl:gap-8 px-3 xl:px-4 py-4"
        >
          {TRIP_COLUMNS.map((col) => (
            <div className={ALIGN_CLASS[col.align]} key={col.key}>
              {t.columns[col.key]}
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
                  className="xl:border-b border-rule/50"
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
                  className={vItem.index % 2 === 1 ? "xl:bg-ink/[0.04]" : ""}
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
