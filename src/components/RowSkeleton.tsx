"use client";

/**
 * Skeleton de UNA fila virtualizada (la que aún no tiene datos cargados).
 *
 * Pensado para renderizarse DENTRO del mismo contenedor absoluto que usas
 * para las filas reales de TanStack Virtual, así que no lleva `position`
 * ni `transform`: eso lo pone el virtualizador.
 *
 * Uso previsto (tú lo implementas):
 *   const row = rows[virtualRow.index];
 *   ... row ? <Row .../> : <RowSkeleton columns={columns} />
 */

type Column = {
  /** ancho en px o cualquier unidad CSS válida ("120px", "12rem", "1fr") */
  width?: number | string;
};

type RowSkeletonProps = {
  /** Mismas columnas (o al menos los mismos anchos) que la tabla real */
  columns: Column[];
  /** Alto de la fila. Debe coincidir con el `estimateSize` del virtualizador */
  height?: number;
  /**
   * 0..1 — variación pseudo-aleatoria del ancho de la barra dentro de cada celda,
   * para que no parezcan todas idénticas. 0 = todas al 100%.
   */
  jitter?: number;
  /** Índice de la fila; se usa como semilla del jitter para que no parpadee */
  index?: number;
  className?: string;
};

/** PRNG determinista y barato: misma fila -> mismo ancho siempre */
function seededWidth(seed: number, jitter: number) {
  const n = Math.sin(seed * 127.1) * 43758.5453;
  const frac = n - Math.floor(n); // 0..1
  const min = 1 - jitter;
  return `${Math.round((min + frac * jitter) * 100)}%`;
}

export function RowSkeleton({
  columns,
  height = 36,
  jitter = 0.45,
  index = 0,
  className = "",
}: RowSkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`flex items-center border-b border-neutral-200 dark:border-neutral-800 ${className}`}
      style={{ height }}
    >
      {columns.map((col, i) => (
        <div
          key={i}
          className="shrink-0 px-3"
          style={{ width: col.width ?? 150 }}
        >
          <div
            className="h-3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            style={{ width: seededWidth(index * columns.length + i, jitter) }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Variante para pintar N skeletons seguidos (por ejemplo al hacer overscan
 * por delante del rango cargado, o mientras llega el siguiente chunk).
 */
export function RowSkeletonGroup({
  count,
  startIndex = 0,
  ...rest
}: RowSkeletonProps & { count: number; startIndex?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <RowSkeleton key={startIndex + i} index={startIndex + i} {...rest} />
      ))}
    </>
  );
}

export default RowSkeleton;
