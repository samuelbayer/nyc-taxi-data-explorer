import * as comlink from 'comlink';
import type { DuckDBService } from '../workers/db.worker.ts';
import { useEffect, useState } from 'react';

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
const parquetUrl = '/sample.parquet';
const parquetName = parquetUrl.split('/').pop() ?? 'sample.parquet';

const viewPromise = dbService.init().then(() =>
    dbService.queryParquet(
        parquetUrl,
        `CREATE TABLE taxi AS
SELECT
  ROW_NUMBER() OVER () AS rn,
  trip_distance,
  fare_amount,
  tip_amount,
  tpep_pickup_datetime,
  tpep_dropoff_datetime,
  passenger_count,
  payment_type
FROM '${parquetName}';`
    )
);




export default function useParquetQuery(): { trips: { tripsArr: TaxiTrip[], range: number[] }, loading: boolean, error: string | null, totalCount: number, indexRange: number[], setIndexRange: React.Dispatch<React.SetStateAction<number[]>> } {
    const [indexRange, setIndexRange] = useState([0, 50])
    const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[], range: number[] }>({ tripsArr: [], range: [0, 50] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0)

    // TEMPORAL — diagnóstico de row groups. Borrar cuando tengamos el dato.
    useEffect(() => {
        viewPromise
            .then(() => dbService.getParquetStats(parquetUrl))
            .then((s) => {
                console.log(
                    `PARQUET_STATS rowGroups=${s.numRowGroups} rows=${s.numRows} ` +
                    s.groups
                        .map((g) => `#${g.id}:${g.rows}f/${(g.bytes / 1024 / 1024).toFixed(2)}MB`)
                        .join(' ')
                );
            })
            .catch((e) => console.error('PARQUET_STATS_ERROR', String(e)));
    }, []);

    useEffect(() => {
        viewPromise.then(async () => {
            const count = await dbService.getParquetTableCount(parquetUrl)
            setTotalCount(Number(count[0].total))
        });
    }, [])

    useEffect(() => {

        async function cargarDatos() {
            try {
                await new Promise(r => setTimeout(r, 1000))
                setLoading(true);

                await viewPromise

                const inicio = performance.now();

                const rnInicio = Math.max(1, (indexRange[0] + 1))
                const rnFin = indexRange[1] + 1
                console.log(`Consultando filas desde ${rnInicio} hasta ${rnFin}`)

                // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
                const resultado = (await dbService.queryParquet(
                    parquetUrl,
                    `SELECT * FROM taxi WHERE rn >= ${rnInicio} AND rn <= ${rnFin} ORDER BY rn`
                )) as TaxiTrip[];

                const fin = performance.now();
                const tiempoTotal = (fin - inicio).toFixed(2);

                console.log(`⚡ Consulta ejecutada en: ${tiempoTotal} ms`);

                setTrips({ tripsArr: resultado, range: [rnInicio - 1, rnFin - 1] });
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