import * as comlink from 'comlink';
import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let initPromise: Promise<void> | null = null;

export type QueryResultRow = Record<string, unknown>;

export const duckDBService = {
  async init(): Promise<void> {
    if (db) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);

      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
      );
      const worker = new Worker(workerUrl);
      const logger = new duckdb.ConsoleLogger();

      const duckDb = new duckdb.AsyncDuckDB(logger, worker);
      await duckDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
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
    sqlQuery?: string
  ): Promise<T[]> {
    if (!db) await this.init();

    const activeDb = db;
    if (!activeDb) {
      throw new Error('DuckDB no se pudo inicializar');
    }

    const conn = await activeDb.connect();
    const fullUrl = new URL(relativePath, self.location.origin).href;
    const fileName = relativePath.split('/').pop() ?? 'file.parquet';

    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el archivo Parquet desde ${fullUrl}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await activeDb.registerFileBuffer(fileName, new Uint8Array(arrayBuffer));

    const query = sqlQuery || `SELECT * FROM '${fileName}' LIMIT 100`;

    const result = await conn.query(query);
    await conn.close();

    return result.toArray().map((row) => row.toJSON() as T);
  },

async getParquetSchema(relativePath: string) {
  const fileName = relativePath.split('/').pop() ?? 'file.parquet';
  return this.queryParquet(relativePath, `DESCRIBE SELECT * FROM '${fileName}'`);
}
};

export type DuckDBService = typeof duckDBService;

comlink.expose(duckDBService);