import * as comlink from "comlink";
import * as duckdb from "@duckdb/duckdb-wasm";

let db: duckdb.AsyncDuckDB | null = null;
let initPromise: Promise<void> | null = null;

const loadingFiles = new Map<string, Promise<void>>();

export type QueryResultRow = Record<string, unknown>;

export const duckDBService = {
  async init(): Promise<void> {
    if (db) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);

      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], {
          type: "text/javascript",
        }),
      );
      const worker = new Worker(workerUrl);
      const DEBUG_DUCKDB = false;
      const logger = DEBUG_DUCKDB
        ? { log: (e: unknown) => console.log("DUCKDB", e) }
        : new duckdb.VoidLogger();

      const duckDb = new duckdb.AsyncDuckDB(logger, worker);
      await duckDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
      await duckDb.open({ filesystem: { forceFullHTTPReads: false, reliableHeadRequests: true, allowFullHTTPReads: true } })
      URL.revokeObjectURL(workerUrl);

      db = duckDb;
    })();

    try {
      await initPromise;
    } finally {
      initPromise = null;
    }
  },

  async queryParquet<T = QueryResultRow>(
    relativePath: string,
    sqlQuery: string,
  ): Promise<T[]> {
    if (!db) await this.init();

    const activeDb = db;
    if (!activeDb) {
      throw new Error("DuckDB couldn't be initialized");
    }
    const BASE = import.meta.env.VITE_PARQUET_BASE || location.origin;
    const fileName = relativePath.split("/").pop() ?? "trips3.parquet";
    const fullUrl = `${BASE}/${fileName}`;
    let registering = loadingFiles.get(fileName);

    if (!registering) {
      registering = (async () => {
        await activeDb.registerFileURL(
          fileName,
          fullUrl,
          duckdb.DuckDBDataProtocol.HTTP,
          true,
        );
        const conn = await activeDb.connect();
        try {
          await conn.query(
            `CREATE OR REPLACE VIEW trips AS SELECT * FROM '${fileName}'`,
          );
        } finally {
          await conn.close();
        }
      })();

      loadingFiles.set(fileName, registering);
      registering.catch(() => loadingFiles.delete(fileName));
    }

    await registering;

    const conn = await activeDb.connect();

    try {
      const result = await conn.query(sqlQuery);
      return result.toArray().map((row) => row.toJSON() as T);
    } finally {
      await conn.close();
    }
  },

  async getParquetTableCount(relativePath: string, where: string) {
    return this.queryParquet(
      relativePath,
      `SELECT COUNT(*) AS total FROM trips ${where}`,
    );
  },
};

export type DuckDBService = typeof duckDBService;

comlink.expose(duckDBService);
