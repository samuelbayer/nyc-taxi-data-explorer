import * as comlink from 'comlink';
import type { DuckDBService } from '../workers/db.worker.ts';
import { useRef, useEffect, useState } from 'react';

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
const worker = new Worker(new URL('../workers/db.worker.ts', import.meta.url), {
    type: 'module',
});


const dbService = comlink.wrap<DuckDBService>(worker);

dbService.init();


export default function useParquetQuery(): { trips: TaxiTrip[], loading: boolean, error: string | null } {

    const [trips, setTrips] = useState<TaxiTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function cargarDatos() {
            try {
                setLoading(true);


                const parquetUrl = '/sample.parquet';
                const parquetName = parquetUrl.split('/').pop() ?? 'sample.parquet';

                const inicio = performance.now();

                // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
                const resultado = (await dbService.queryParquet(
                    parquetUrl,
                    `SELECT * FROM '${parquetName}' WHERE tip_amount > 0 LIMIT 1000`
                )) as TaxiTrip[];

                const fin = performance.now();
                const tiempoTotal = (fin - inicio).toFixed(2);

                console.log(`⚡ Consulta ejecutada en: ${tiempoTotal} ms`);

                setTrips(resultado);
            } catch (err) {
                console.error('Error leyendo Parquet:', err);
                setError('No se pudo cargar el archivo Parquet');
            } finally {
                setLoading(false);
            }
        }

        cargarDatos();
        dbService.getParquetSchema('/sample.parquet').then(schema => {
            console.log('Esquema del Parquet:', schema);
        })

    }, []);


    return { trips, loading, error }


}