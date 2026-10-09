import * as comlink from "comlink";
import type { DuckDBService } from "../workers/db.worker.ts";
import { useEffect, useState, useMemo, useRef } from "react";
import { buildWhere } from "../lib/filters.ts";
import { type TaxiTrip, type Filters, type Phase } from "../types";

const worker = new Worker(new URL("../workers/db.worker.ts", import.meta.url), {
  type: "module",
});

const dbService = comlink.wrap<DuckDBService>(worker);
const parquetUrl = "/trips3.parquet";

export default function useParquetQuery(filters: Filters, setDownloadProgress: React.Dispatch<React.SetStateAction<number | null>>, setIsFullFileReady: React.Dispatch<React.SetStateAction<boolean>>): {
  trips: { tripsArr: TaxiTrip[]; range: number[] };
  loading: boolean;
  error: string | null;
  totalCount: number;
  indexRange: number[];
  setIndexRange: React.Dispatch<React.SetStateAction<number[]>>;
  queryMs: number | null;
  phase: Phase;
} {
  const [indexRange, setIndexRange] = useState([0, 499]);
  const [trips, setTrips] = useState<{ tripsArr: TaxiTrip[]; range: number[] }>(
    { tripsArr: [], range: [0, 499] },
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [queryMs, setQueryMs] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("engine");
  const alreadyDownloadedRef = useRef(false)

  const where = useMemo(() => buildWhere(filters), [filters]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    async function getParquetTableCount() {
      try {
        const count = await dbService.getParquetTableCount(parquetUrl, where);
        if (cancelled) return;
        setTotalCount(Number(count[0].total));
      } catch (err) {
        if (cancelled) return;
        console.error("Error reading ParquetTableCount:", err);
      }
    }

    getParquetTableCount();

    return () => {
      cancelled = true;
    };
  }, [where]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await dbService.init();
        if (cancelled) return;
        setPhase("query");
      } catch (err) {
        if (cancelled) return;
        console.error("Error starting DuckDB:", err);
        setError("Could not start the database engine");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== 'ready' || alreadyDownloadedRef.current) return
    dbService.loadFullFile(parquetUrl, comlink.proxy((loaded) => setDownloadProgress(Math.round(loaded)))).then(() => setIsFullFileReady(true))
    alreadyDownloadedRef.current = true
  }, [phase, setDownloadProgress, setIsFullFileReady])

  useEffect(() => {
    let cancelled = false;

    async function loadRows() {
      try {
        setLoading(true);
        setError(null);

        const start = performance.now();
        const rows = (await dbService.queryParquet(
          parquetUrl,
          `SELECT pickup, duration_s, distance_cent, fare_cents, tip_cents, passengers, payment_type FROM trips ${where} LIMIT ${indexRange[1] - indexRange[0] + 1} OFFSET ${indexRange[0]}`,
        )) as TaxiTrip[];

        const end = performance.now();
        const ms = (end - start).toFixed(2);

        if (cancelled) return;
        setQueryMs(Number(ms));
        setTrips({ tripsArr: rows, range: indexRange });
        setPhase("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("Error reading Parquet:", err);
        setError("The Parquet file could not be loaded");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRows();

    return () => {
      cancelled = true;
    };
  }, [indexRange, where]);

  return {
    trips,
    loading,
    error,
    totalCount,
    indexRange,
    setIndexRange,
    queryMs: queryMs,
    phase,
  };
}
