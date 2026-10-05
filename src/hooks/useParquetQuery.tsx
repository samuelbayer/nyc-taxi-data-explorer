import * as comlink from "comlink";
import type { DuckDBService } from "../workers/db.worker.ts";
import { useEffect, useState, useMemo } from "react";
import { construirWhere } from "../lib/filters.ts";
import { type TaxiTrip, type Filters, type Phase } from "../types";

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
  phase: Phase;
} {
  const [indexRange, setIndexRange] = useState([0, 499]);
  const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[]; range: number[] }>(
    { tripsArr: [], range: [0, 499] },
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("engine");

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
        console.error("Error reading ParquetTableCount:", err);
      }
    }

    getParquetTableCount();

    return () => {
      cancelado = true;
    };
  }, [where]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        await dbService.init();
        if (cancelado) return;
        setPhase("query");
      } catch (err) {
        if (cancelado) return;
        console.error("Error starting DuckDB:", err);
        setError("Could not start the database engine");
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function cargarDatos() {
      try {
        setLoading(true);
        setError(null);

        const inicio = performance.now();
        const resultado = (await dbService.queryParquet(
          parquetUrl,
          `SELECT pickup, duration_s, distance_cent, fare_cents, tip_cents, passengers, payment_type FROM 'trips3.parquet' ${where} LIMIT ${indexRange[1] - indexRange[0] + 1} OFFSET ${indexRange[0]}`,
        )) as TaxiTrip[];

        const fin = performance.now();
        const ms = (fin - inicio).toFixed(2);

        if (cancelado) return;
        setTiempoTotal(Number(ms));
        setTrips({ tripsArr: resultado, range: indexRange });
        setPhase("ready");
      } catch (err) {
        if (cancelado) return;
        console.error("Error reading Parquet:", err);
        setError("The Parquet file could not be loaded");
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
    phase,
  };
}
