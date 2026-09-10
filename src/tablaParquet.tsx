import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'
import useParquetQuery from './hooks/useParquetQuery';
import { Slider } from 'antd';
import { RowSkeleton } from './components/RowSkeleton'





export const TablaParquet: React.FC = () => {
    const [filters, setFilters] = useState({
        fareAmount: 0,
        milesDistance: [0, 100],
    })

    const { error, loading, trips, totalCount, setIndexRange } = useParquetQuery() //minmax
    const filteredTrips = useMemo(() => {
        const filter = trips.tripsArr.filter(trip => {
            if ((trip.fare_cents / 100)! < filters.fareAmount) return false
            if ((trip.fare_cents / 100)! < filters.milesDistance[0] || (trip.fare_cents / 100) > filters.milesDistance[1]) return false
            return true
        })
        return (filter)
    }, [trips, filters])
    const scrollRef = useRef<HTMLDivElement>(null)

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

        const newFirstIndex = Math.max(0, firstIndex - 20)
        const newLastIndex = lastIndex + 20

        setIndexRange((prev) => {
            const [prevMin, prevMax] = prev;
            if (prevMin === newFirstIndex && prevMax === newLastIndex) return prev;
            if (newFirstIndex >= prevMin && newLastIndex <= prevMax) return prev;
            return [newFirstIndex, newLastIndex];
        });
    }, [
        firstIndex,
        lastIndex,
        virtualItems.length, setIndexRange
    ]);


    function checkTypePayment(type: number | null): string {
        if (type === 0) return 'Flex Fare trip'
        if (type === 1) return 'Credit card'
        if (type === 2) return 'Cash'
        if (type === 3) return 'No charge'
        if (type === 4) return 'Dispute'
        if (type === 5) return 'Unknown'
        return 'Voided trip'
    }

    if (loading && trips.tripsArr.length === 0) return <div>Cargando datos desde Parquet con DuckDB...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <>

            <label htmlFor="mi-rango">Filtro de minimo de pago:</label>
            <p>${filters.fareAmount}</p>
            <input
                type="range"
                id="mi-rango"
                min="0"
                max="10"
                step="1"
                value={filters.fareAmount}
                onChange={e => setFilters(prev => ({ ...prev, fareAmount: Number(e.target.value) }))}
            />
            <div style={{ width: 300, padding: 20 }}>
                <Slider range
                    value={filters.milesDistance}
                    onChange={(valor) => setFilters(prev => ({ ...prev, milesDistance: valor }))}
                    max={100} />
            </div>
            <h2>Viajes con Propina ({filteredTrips.length})</h2>

            <div ref={scrollRef} className='h-[85dvh] w-[85dvw] overflow-auto'>

                <div className='hidden will-change-transform bg-slate-950 z-10 sticky top-0 md:grid grid-cols-8 gap-4 px-3 md:px-4 py-3 border-slate-950 border-8'>
                    <div>Distancia:</div>
                    <div>Tarifa:</div>
                    <div>Propina:</div>
                    <div>Tiempo:</div>
                    <div>Hora de recogida</div>
                    <div>Hora de llegada:</div>
                    <div>Pasajeros:</div>
                    <div>Tipo de pago:</div>
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

                        const hour = Math.floor((trip.duration_s / 60 / 60))
                        const minutos = Math.floor((trip.duration_s % 3600) / 60)
                        const pickUpDate = new Date(trip.pickup)
                        const dropOffDate = new Date((trip.pickup) + trip.duration_s * 1000)
                        return (
                            <div className='absolute flex top-0 left-0 w-full border-b border-slate-900' style={{ transform: `translateY(${vItem.start}px)`, height: `${vItem.size}px` }} key={vItem.key} data-index={vItem.index}>
                                <div className="w-full items-center p-3 md:py-2 md:px-4 md:grid grid-cols-8 gap-4  ">
                                    <p>{trip.distance_cent / 100} millas</p>
                                    <p>${(trip.fare_cents / 100).toFixed(2)}</p>
                                    <p>${trip.tip_cents / 100}</p>
                                    <p>{hour < 1 ? `${minutos} minutos` : `${hour} horas y ${minutos} minutos `}</p>
                                    <p>{pickUpDate.toLocaleString()}</p>
                                    <p>{dropOffDate.toLocaleString()}</p>
                                    <p>{trip.passengers}</p>
                                    <p>{checkTypePayment(Number(trip.payment_type))}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};
