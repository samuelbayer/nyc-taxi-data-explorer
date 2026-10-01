import * as comlink from "comlink";
import type { DuckDBService } from "../workers/db.worker.ts";
import { useEffect, useState, useMemo } from "react";
import { construirWhere } from "../lib/filters.ts";
import { type TaxiTrip, type Filters } from "../types";

// 2. Instanciamos el worker con soporte para módulos ES (compatible con Vite / Webpack 5)
const worker = new Worker(new URL("../workers/db.worker.ts", import.meta.url), {
  type: "module",
});

const dbService = comlink.wrap<DuckDBService>(worker);
const parquetUrl = "/trips3.parquet";

export default function useParquetQuery(filters: Filters): {
  trips: { tripsArr: TaxiTrip[]; range: number[] };
  loading: boolean;
  error: string | null;
  totalCount: number;
  indexRange: number[];
  setIndexRange: React.Dispatch<React.SetStateAction<number[]>>;
  tiempoTotal: number | null;
} {
  const [indexRange, setIndexRange] = useState([0, 499]);
  const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[]; range: number[] }>(
    { tripsArr: [], range: [0, 499] },
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);

  const where = useMemo(() => construirWhere(filters), [filters]);

  useEffect(() => {
    let cancelado = false;
    setError(null);
    async function getParquetTableCount() {
      try {
        const count = await dbService.getParquetTableCount(parquetUrl, where);
        if (cancelado) return;
        setTotalCount(Number(count[0].total));
      } catch (err) {
        if (cancelado) return;
        console.error("Error leyendo ParquetTableCount:", err);
      }
    }

    getParquetTableCount();

    return () => {
      cancelado = true;
    };
  }, [where]);

  useEffect(() => {
    let cancelado = false;

    async function cargarDatos() {
      try {
        setLoading(true);
        setError(null);

        const inicio = performance.now();
        console.log(where);
        // Pedimos los datos al worker. 'resultado' ya es un Array de objetos JSON tipado como Usuario[]
        const resultado = (await dbService.queryParquet(
          parquetUrl,
          `SELECT pickup, duration_s, distance_cent, fare_cents, tip_cents, passengers, payment_type FROM 'trips3.parquet' ${where} LIMIT ${indexRange[1] - indexRange[0] + 1} OFFSET ${indexRange[0]}`,
        )) as TaxiTrip[];

        const fin = performance.now();
        const ms = (fin - inicio).toFixed(2);

        if (cancelado) return;
        setTiempoTotal(Number(ms));
        setTrips({ tripsArr: resultado, range: indexRange });
      } catch (err) {
        if (cancelado) return;
        console.error("Error leyendo Parquet:", err);
        setError("No se pudo cargar el archivo Parquet");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarDatos();

    return () => {
      cancelado = true;
    };
  }, [indexRange, where]);

  return {
    trips,
    loading,
    error,
    totalCount,
    indexRange,
    setIndexRange,
    tiempoTotal,
  };
}
