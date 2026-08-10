import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'
import useParquetQuery from './hooks/useParquetQuery';
import type { TaxiTrip } from './hooks/useParquetQuery';
import { Slider } from 'antd';



export const TablaParquet: React.FC = () => {

    const { error, loading, trips } = useParquetQuery()

    const [filteredTrips, setFilteredTrips] = useState<TaxiTrip[]>(trips);

    const [filterAmount, setFilterAmount] = useState<number>(0)
    const [rango, setRango] = useState([0, 100])

    const scrollRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: filteredTrips.length,
        estimateSize: () => 80,
        getScrollElement: () => scrollRef.current
    })

    const virtualItems = virtualizer.getVirtualItems()



    const filterByAmount = useMemo(() => {
        return (function filterByAmount(amount: number) {
            if (amount <= 0) {
                setFilteredTrips(trips)
                return
            }
            const filter = trips.filter(trip => trip.fare_amount! > amount)
            setFilteredTrips(filter)
            return
        })
    }, [trips])

    function filterByDistance(distance: number) {
        if ()
    }


    useEffect(() => {
        filterByAmount(filterAmount)
    }, [filterAmount, filterByAmount, trips])


    function checkTypePayment(type: number | null): string {
        if (type === 0) return 'Flex Fare trip'
        if (type === 1) return 'Credit card'
        if (type === 2) return 'Cash'
        if (type === 3) return 'No charge'
        if (type === 4) return 'Dispute'
        if (type === 5) return 'Unknown'
        return 'Voided trip'
    }

    if (loading) return <div>Cargando datos desde Parquet con DuckDB...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <>

            <label htmlFor="mi-rango">Selecciona un número:</label>
            <p>{filterAmount}</p>
            <input
                type="range"
                id="mi-rango"
                min="0"
                max="10"
                step="1"
                value={filterAmount}
                onChange={e => setFilterAmount(Number(e.target.value))}
            />
            <div style={{ width: 300, padding: 20 }}>
                <Slider range
                    value={rango}
                    onChange={(valor) => setRango(valor)}
                    max={1000} />
            </div>
            <h2>Viajes con Propina ({filteredTrips.length})</h2>
            <div className='hidden md:grid grid-cols-8 gap-4 w-[85dvw] px-7 my-2'>
                <div>Distancia:</div>
                <div>Tarifa:</div>
                <div>Propina:</div>
                <div>Tiempo:</div>
                <div>Hora de recogida</div>
                <div>Hora de llegada:</div>
                <div>Pasajeros:</div>
                <div>Tipo de pago:</div>
            </div>
            <div ref={scrollRef} className='scrollbar-gutter-both h-[85dvh] w-[85dvw] overflow-auto'>


                <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
                    {virtualItems.map((vItem) => {

                        const trip = filteredTrips[vItem.index]
                        const pickUpdate = new Date(Number(trip.tpep_pickup_datetime))
                        const dropOffDate = new Date(Number(trip.tpep_dropoff_datetime))
                        const durationOfTrip = dropOffDate.getTime() - pickUpdate.getTime()
                        const minutosTotales = durationOfTrip / (1000 * 60)
                        const hour = Math.floor(durationOfTrip / (1000 * 60 * 60))
                        const minutos = Math.floor(minutosTotales % 60)
                        return (
                            <div className='absolute top-0 left-0 w-full' style={{ transform: `translateY(${vItem.start}px)`, height: `${vItem.size}` }} key={vItem.key} data-index={vItem.index}>
                                <div key={vItem.key} data-index={vItem.index} className="p-3 md:py-2 md:px-4 md:grid grid-cols-8 gap-4 ">
                                    <p>{trip.trip_distance} millas</p>
                                    <p>${trip.fare_amount}</p>
                                    <p>${trip.tip_amount}</p>
                                    <p>{hour < 1 ? `${minutos} minutos` : `${hour} horas y ${minutos} minutos `}</p>
                                    <p>{pickUpdate.toLocaleString()}</p>
                                    <p>{dropOffDate.toLocaleString()}</p>
                                    <p>{trip.passenger_count}</p>
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