"use client";

/**
 * Skeleton de pantalla completa: se muestra desde que entras a la página
 * hasta que TablaParquet está montada y con el primer lote de datos.
 *
 * No usa datos reales: recibe cuántas columnas/filas falsas dibujar.
 * Pensado para ir en un <Suspense fallback={...}> o detrás de un
 * `if (!ready) return <TablaParquetSkeleton />`.
 */

type TablaParquetSkeletonProps = {
  /** Nº de columnas falsas a dibujar */
  columns?: number;
  /** Nº de filas falsas (suficientes para llenar el viewport) */
  rows?: number;
  /** Alto de fila, el mismo que usa la tabla real */
  rowHeight?: number;
  /** Alto del contenedor scrollable */
  bodyHeight?: number | string;
};

export function TablaParquetSkeleton({
  columns = 8,
  rows = 20,
  rowHeight = 36,
  bodyHeight = "70vh",
}: TablaParquetSkeletonProps) {
  const cols = Array.from({ length: columns });
  const rowsArr = Array.from({ length: rows });

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex w-full flex-col gap-4"
    >
      {/* --- Cabecera / título --- */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-3 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* --- Barra de controles (buscador, filtros, contador de filas) --- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-9 w-72 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        <div className="ml-auto h-4 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* --- Tabla --- */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        {/* header sticky falso */}
        <div
          className="flex items-center border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
          style={{ height: rowHeight }}
        >
          {cols.map((_, i) => (
            <div key={i} className="flex-1 px-3">
              <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-300 dark:bg-neutral-600" />
            </div>
          ))}
        </div>

        {/* cuerpo */}
        <div style={{ height: bodyHeight }} className="overflow-hidden">
          {rowsArr.map((_, r) => (
            <div
              key={r}
              className={`flex items-center border-b border-neutral-100 dark:border-neutral-800/60 ${
                r % 2 === 1 ? "bg-neutral-50/60 dark:bg-neutral-900/40" : ""
              }`}
              style={{
                height: rowHeight,
                /* las de abajo se desvanecen: da sensación de "hay más" */
                opacity: Math.max(0.25, 1 - r / rows),
              }}
            >
              {cols.map((_, c) => (
                <div key={c} className="flex-1 px-3">
                  <div
                    className="h-3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"
                    style={{ width: `${50 + ((r * 13 + c * 29) % 45)}%` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Cargando datos…</span>
    </div>
  );
}

export default TablaParquetSkeleton;
