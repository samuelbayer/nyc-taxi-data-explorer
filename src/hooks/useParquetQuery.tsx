import * as comlink from 'comlink';
import type { DuckDBService } from '../workers/db.worker.ts';
import { useEffect, useState } from 'react';

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


const dbService = comlink.wrap<DuckDBService>(worker);
const parquetUrl = '/trips3.parquet';



export default function useParquetQuery(): { trips: { tripsArr: TaxiTrip[], range: number[] }, loading: boolean, error: string | null, totalCount: number, indexRange: number[], setIndexRange: React.Dispatch<React.SetStateAction<number[]>> } {
    const [indexRange, setIndexRange] = useState([0, 50])
    const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[], range: number[] }>({ tripsArr: [], range: [0, 50] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0)

    const getParquetTableCount = async () => {
        const count = await dbService.getParquetTableCount(parquetUrl)
        setTotalCount(Number(count[0].total))
    }

    useEffect(() => {
        getParquetTableCount()
    }, [])

    useEffect(() => {

        async function cargarDatos() {
            try {
                setLoading(true);


                const inicio = performance.now();

                console.log(`Consultando filas desde ${indexRange[0]} hasta ${indexRange[1]}`)

                // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
                const resultado = (await dbService.queryParquet(
                    parquetUrl,
                    `SELECT * FROM 'trips3.parquet' LIMIT ${indexRange[1] - indexRange[0] + 1} OFFSET ${indexRange[0]}`
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

    }, [indexRange]);


    return { trips, loading, error, totalCount, indexRange, setIndexRange }


}