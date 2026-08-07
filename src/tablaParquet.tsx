import React, { useState, useEffect, useRef } from 'react';
import * as comlink from 'comlink';
import type { DuckDBService } from './workers/db.worker.ts';
import { useVirtualizer } from '@tanstack/react-virtual'


// 1. Tipamos la estructura de los datos que esperamos del Parquet
export interface TaxiTrip {
    VendorID: number | null;
    tpep_pickup_datetime: string | Date | null;
    tpep_dropoff_datetime: string | Date | null;
    passenger_count: number | null;
    trip_distance: number | null;
    RatecodeID: number | null;
    store_and_fwd_flag: string | null;
    PULocationID: number | null;
    DOLocationID: number | null;
    payment_type: number | null;
    fare_amount: number | null;
    extra: number | null;
    mta_tax: number | null;
    tip_amount: number | null;
    tolls_amount: number | null;
    improvement_surcharge: number | null;
    total_amount: number | null;
    congestion_surcharge: number | null;
    Airport_fee: number | null;
    cbd_congestion_fee: number | null;
}


// 2. Instanciamos el worker con soporte para módulos ES (compatible con Vite / Webpack 5)
const worker = new Worker(new URL('./workers/db.worker.ts', import.meta.url), {
    type: 'module',
});


const dbService = comlink.wrap<DuckDBService>(worker);


export const TablaParquet: React.FC = () => {
    // Estado con el tipo exacto que esperamos
    const [trips, setTrips] = useState<TaxiTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: trips.length,
        estimateSize: () => 80,
        getScrollElement: () => scrollRef.current
    })

    const virtualItems = virtualizer.getVirtualItems()


    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true);


                const parquetUrl = '/sample.parquet';
                const parquetName = parquetUrl.split('/').pop() ?? 'sample.parquet';

                // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
                const resultado = (await dbService.queryParquet(
                    parquetUrl,
                    `SELECT * FROM ${parquetName} WHERE tip_amount > 0 LIMIT 5000`
                )) as TaxiTrip[];

                setTrips(resultado);
            } catch (err) {
                console.error('Error leyendo Parquet:', err);
                setError('No se pudo cargar el archivo Parquet');
            } finally {
                setLoading(false);
            }
        }

        cargarDatos();
    }, []);


    useEffect(() => {
        async function verEsquema() {
            // Te devolverá un array con los nombres de columnas y sus tipos de datos (VARCHAR, BIGINT, DOUBLE, etc.)
            const columnas = await dbService.getParquetSchema('/sample.parquet');
            console.log('Estructura del Parquet:', columnas);
        }
        verEsquema();
    }, []);

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
            <h2>Viajes con Propina ({trips.length})</h2>
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

                        const trip = trips[vItem.index]
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