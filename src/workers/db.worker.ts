import * as comlink from 'comlink';
import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let initPromise: Promise<void> | null = null;

const loadedFiles = new Set<string>();

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
    const fileName = relativePath.split('/').pop() ?? 'file.parquet';
    
    if (!loadedFiles.has(fileName)) {
      const fullUrl = new URL(relativePath, self.location.origin).href;
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`No se pudo cargar el archivo Parquet desde ${fullUrl}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      await activeDb.registerFileBuffer(fileName, new Uint8Array(arrayBuffer));
      loadedFiles.add(fileName); // Marcamos como cargado
    }

    const conn = await activeDb.connect();
   

    const query = sqlQuery || `SELECT * FROM '${fileName}' LIMIT 100`;

    const result = await conn.query(query);
    await conn.close();

    return result.toArray().map((row) => row.toJSON() as T);
  },

async getParquetTableCount(relativePath: string) {
  return this.queryParquet(relativePath, `SELECT COUNT(*) AS total FROM taxi`);
},

// TEMPORAL — diagnóstico de row groups. Borrar cuando tengamos el dato.
async getParquetStats(relativePath: string) {
  const fileName = relativePath.split('/').pop() ?? 'file.parquet';
  const toNum = (v: unknown) => Number(v ?? 0);

  const [file] = await this.queryParquet<Record<string, unknown>>(
    relativePath,
    `SELECT num_rows, num_row_groups FROM parquet_file_metadata('${fileName}')`
  );

  const groups = await this.queryParquet<Record<string, unknown>>(
    relativePath,
    `SELECT row_group_id,
            MAX(row_group_num_rows) AS n_rows,
            SUM(total_compressed_size) AS n_bytes
     FROM parquet_metadata('${fileName}')
     GROUP BY row_group_id
     ORDER BY row_group_id`
  );

  return {
    numRows: toNum(file?.num_rows),
    numRowGroups: toNum(file?.num_row_groups),
    groups: groups.map((g) => ({
      id: toNum(g.row_group_id),
      rows: toNum(g.n_rows),
      bytes: toNum(g.n_bytes),
    })),
  };
}
};

export type DuckDBService = typeof duckDBService;

comlink.expose(duckDBService);