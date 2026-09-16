import * as comlink from 'comlink';
import type { DuckDBService } from '../workers/db.worker.ts';
import { useCallback, useEffect, useState } from 'react';

export interface TaxiTrip {
    pickup: number;
    duration_s: number;
    distance_cent: number;
    fare_cents: number;
    tip_cents: number;
    passengers: number;
    payment_type: number;
}


// 2. Instanciamos el worker con soporte para módulos ES (compatible con Vite / Webpack 5)
const worker = new Worker(new URL('../workers/db.worker.ts', import.meta.url), {
    type: 'module',
});

function construirWhere(filters: { fareAmount: number, milesDistance: number[] }): string {
    const fareAmountCondition = filters.fareAmount > 0 ? `fare_cents >= ${filters.fareAmount * 100}` : '';
    const milesDistanceCondition = `distance_cent BETWEEN ${filters.milesDistance[0] * 100} AND ${filters.milesDistance[1] * 100}`
    //TODO: añadir un debounced para que no se ejecute la query cada vez que se cambia el filtro, sino que espere un tiempo a que el usuario deje de cambiar los filtros
    const cond: string[] = [milesDistanceCondition]

    // aquí cada filtro empuja su condición si procede

    return cond.length ? `WHERE ${cond.join(' AND ')}` : ''
}


const dbService = comlink.wrap<DuckDBService>(worker);
const parquetUrl = '/trips3.parquet';


export default function useParquetQuery(filters: { fareAmount: number, milesDistance: number[] }): { trips: { tripsArr: TaxiTrip[], range: number[] }, loading: boolean, error: string | null, totalCount: number, indexRange: number[], setIndexRange: React.Dispatch<React.SetStateAction<number[]>> } {
    const [indexRange, setIndexRange] = useState([0, 499])
    const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[], range: number[] }>({ tripsArr: [], range: [0, 499] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0)

    const where = construirWhere(filters)

    const getParquetTableCount = useCallback(async () => {
        const count = await dbService.getParquetTableCount(parquetUrl, where)
        setTotalCount(Number(count[0].total))
    }, [where])



    useEffect(() => {
        getParquetTableCount()
        console.log(filters)
    }, [filters, getParquetTableCount])

    useEffect(() => {

        async function cargarDatos() {
            try {
                setLoading(true);


                const inicio = performance.now();

                console.log(`Consultando filas desde ${indexRange[0]} hasta ${indexRange[1]}`)

                // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
                const resultado = (await dbService.queryParquet(
                    parquetUrl,
                    `SELECT pickup, duration_s, distance_cent, fare_cents, tip_cents, passengers, payment_type FROM 'trips3.parquet' ${where} LIMIT ${indexRange[1] - indexRange[0] + 1} OFFSET ${indexRange[0]}`
                )) as TaxiTrip[];

                const fin = performance.now();
                const tiempoTotal = (fin - inicio).toFixed(2);

                console.log(`⚡ Consulta ejecutada en: ${tiempoTotal} ms`);

                setTrips({ tripsArr: resultado, range: indexRange });

            } catch (err) {
                console.error('Error leyendo Parquet:', err);
                setError('No se pudo cargar el archivo Parquet');
            } finally {
                setLoading(false);
            }
        }

        cargarDatos();

    }, [indexRange, filters, where]);


    return { trips, loading, error, totalCount, indexRange, setIndexRange, }


}