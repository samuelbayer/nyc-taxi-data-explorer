import React, { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'
import useParquetQuery from '../hooks/useParquetQuery';
import { Slider } from 'antd';
import { RowSkeleton } from './RowSkeleton'
import useDebounce from '../hooks/useDebounce';
import { TRIP_COLUMNS } from '../lib/columns';
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from '../lib/filters.ts'
import { formatInteger } from "../lib/format"

const BLOQUE = 500


export const TablaParquet: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState({
    fareAmount: 0,
    milesDistance: [0, MAX_MILES_DISTANCE],
    paymentType: ALL_PAYMENT_TYPES,
    passengerNumber: 0,
    hideNegativeFare: false
  })
  const filtersDebounced = useDebounce(filters, 300)

  const { error, loading, trips, totalCount, setIndexRange, tiempoTotal } = useParquetQuery(filtersDebounced) //minmax

  const [prevFilters, setPrevFilters] = useState(filtersDebounced)
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
    estimateSize: () => 80,
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
      <label htmlFor='hide-negative-amounts'>Esconder importes negativos</label>
      <input id='hide-negative-amounts' type='checkbox' checked={filters.hideNegativeFare} onChange={e => setFilters(prev => ({ ...prev, hideNegativeFare: e.target.checked }))}></input>
      <label htmlFor="payment-range">Filtro de minimo de pago:</label>
      <p>${filters.fareAmount}</p>
      <input
        type="range"
        id="payment-range"
        min="0"
        max="1000"
        step="1"
        value={filters.fareAmount}
        style={{ width: '300px' }}
        onChange={e => setFilters(prev => ({ ...prev, fareAmount: Number(e.target.value) }))}
      />
      <label htmlFor='type-payment'>Tipo de pago</label>
      <select id='type-payment' value={filters.paymentType} onChange={(e) => setFilters(prev => ({ ...prev, paymentType: Number(e.target.value) }))} className='text-white bg-gray-900' style={{ color: 'white' }} >
        <option value={ALL_PAYMENT_TYPES}>Sin filtro</option>
        <option value="0">Flex Fare trip</option>
        <option value="1">Credit card</option>
        <option value="2">Cash</option>
        <option value="3">No charge</option>
        <option value="4">Dispute</option>
        <option value="5">Unknown</option>
        <option value="6">Voided trip</option>
      </select>
      <label htmlFor='number-passengers'>Cantidad de pasajeros a partir de: {filters.passengerNumber}</label>
      <input type="range"
        id="number-passengers"
        min="0"
        max="9"
        step="1"
        value={filters.passengerNumber}
        style={{ width: '300px' }}
        onChange={e => setFilters(prev => ({ ...prev, passengerNumber: Number(e.target.value) }))}></input>
      <div style={{ width: 350, padding: 20 }}>
        <label htmlFor='miles-range'>Filtro de distancia en millas: {filters.milesDistance[0]} - {filters.milesDistance[1]}</label>
        <Slider range
          id='miles-range'
          value={filters.milesDistance}
          onChange={(valor) => setFilters(prev => ({ ...prev, milesDistance: valor }))}
          max={MAX_MILES_DISTANCE} />
      </div>
      {totalCount === 0 ?
        <h2>No hay datos que cumplan con los filtros seleccionados</h2>
        : <h2>Viendo filas {formatInteger(firstIndex + 1)} a {formatInteger(lastIndex + 1)} de <i> {formatInteger(totalCount)}</i> en {formatInteger(tiempoTotal as number)}ms</h2>}

      <div ref={scrollRef} className='h-[85dvh] w-[85dvw] overflow-auto'>

        <div className='hidden will-change-transform bg-slate-950 z-10 sticky top-0 md:grid grid-cols-8 gap-4 px-3 md:px-4 py-3 border-slate-950 border-8'>
          {TRIP_COLUMNS.map((col) => <div key={col.key}>{col.label}</div>)}
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
                <div className="w-full items-center p-3 md:py-2 md:px-4 md:grid grid-cols-8 gap-4  ">
                  {TRIP_COLUMNS.map((col) => <p key={col.key}>{col.render(trip)}</p>)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
};
