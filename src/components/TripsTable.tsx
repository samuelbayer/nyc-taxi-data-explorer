import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'
import useParquetQuery from '../hooks/useParquetQuery.tsx';
import { RowSkeleton } from './RowSkeleton.tsx'
import { TRIP_COLUMNS } from '../lib/columns.ts';
import { ALIGN_CLASS } from "../lib/columns.ts"
import { TRIP_GRID_STYLE } from "../lib/columns.ts"
import type { Filters } from '../types.ts'
import { formatInteger } from "../lib/format"

const BLOQUE = 500

type Props = { filtersDebounced: Filters }


export const TripsTable: React.FC<Props> = ({ filtersDebounced }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [prevFilters, setPrevFilters] = useState(filtersDebounced)
  const { error, loading, trips, totalCount, setIndexRange, tiempoTotal } = useParquetQuery(filtersDebounced) //minmax

  if (filtersDebounced !== prevFilters) {
    setPrevFilters(filtersDebounced)
    setIndexRange([0, BLOQUE - 1])
  }


  useEffect(() => {
    // Reiniciamos el rango de índices al cambiar los filtros
    scrollRef.current?.scrollTo({ top: 0 })
  }, [filtersDebounced])

  const virtualizer = useVirtualizer({
    count: totalCount,
    estimateSize: () => 60,
    getScrollElement: () => scrollRef.current
  })

  const virtualItems = virtualizer.getVirtualItems()

  const firstIndex = virtualItems[0]?.index ?? 0;
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  useEffect(() => {
    if (virtualItems.length === 0) return;

    const start = Math.floor(firstIndex / BLOQUE) * BLOQUE
    const end = Math.ceil((lastIndex + 1) / BLOQUE) * BLOQUE - 1

    const handler = setTimeout(() => {
      setIndexRange((prev) => {
        const [prevMin, prevMax] = prev;
        if (prevMin === start && prevMax === end) return prev;
        return [start, end];
      });
    }, 300); // E

    return () => {
      clearTimeout(handler);
    };
  }, [
    firstIndex,
    lastIndex,
    virtualItems.length, setIndexRange
  ]);

  if (loading && trips.tripsArr.length === 0) return <div>Cargando datos desde Parquet con DuckDB...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>

      {totalCount === 0 ?
        <h2>No hay datos que cumplan con los filtros seleccionados</h2>
        : <h2>Viendo filas {formatInteger(firstIndex + 1)} a {formatInteger(lastIndex + 1)} de <i> {formatInteger(totalCount)}</i> en {formatInteger(tiempoTotal as number)}ms</h2>}

      <div ref={scrollRef} className='h-[85dvh] w-full mx-auto overflow-auto'>
        <div style={TRIP_GRID_STYLE} className='hidden will-change-transform text-xs uppercase tracking-wide text-slate-400 border-b border-slate-700 bg-slate-950 z-10 sticky top-0 md:grid gap-8 px-3 md:px-4 py-4'>
          {TRIP_COLUMNS.map((col) => <div className={ALIGN_CLASS[col.align]} key={col.key}>{col.label}</div>)}
        </div>
        <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualItems.map((vItem) => {
            const trip = trips.tripsArr[vItem.index - trips.range[0]]

            if (!trip) {
              return (
                <div className='absolute top-0 left-0 w-full border-b border-slate-900' style={{ transform: `translateY(${vItem.start}px)`, height: `${vItem.size}px` }} key={vItem.key} data-index={vItem.index}>
                  <RowSkeleton index={vItem.index} />
                </div>
              )
            }

            return (
              <div className='absolute flex top-0 left-0 w-full border-b border-slate-900' style={{ transform: `translateY(${vItem.start}px)`, height: `${vItem.size}px` }} key={vItem.key} data-index={vItem.index}>
                <div style={TRIP_GRID_STYLE} className="w-full items-center p-3 md:py-2 md:px-4 md:grid gap-8 odd:bg-slate-900/40 even:bg-slate-900/20">
                  {TRIP_COLUMNS.map((col) => <p className={ALIGN_CLASS[col.align] + (col.muted ? ' text-slate-400' : '')} key={col.key}>{col.render(trip)}</p>)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
};
