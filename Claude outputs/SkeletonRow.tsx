"use client";

/**
 * Fila placeholder para el virtualizador.
 *
 * Se pinta cuando TanStack Virtual pide un índice cuyo dato todavía no
 * ha llegado del worker / DuckDB (row === undefined).
 *
 * IMPORTANTE: tiene que ocupar EXACTAMENTE el mismo alto y el mismo
 * reparto de columnas que la fila real, o el scroll pegará saltos.
 */

type SkeletonRowProps = {
  /** Anchos de columna, en el mismo orden que la tabla real. Ej: [80, 200, 140] */
  columnWidths: number[];
  /** Alto de fila, el mismo que le pasas a estimateSize() */
  height: number;
  /** Estilo del virtualizador (position/transform/top). Se mergea al final. */
  style?: React.CSSProperties;
  /** Para alternar el color de fondo si tu tabla usa zebra striping */
  striped?: boolean;
};

export function SkeletonRow({
  columnWidths,
  height,
  style,
  striped = false,
}: SkeletonRowProps) {
  return (
    <div
      role="row"
      aria-busy="true"
      className={`absolute top-0 left-0 flex w-full items-center border-b border-neutral-200 dark:border-neutral-800 ${
        striped ? "bg-neutral-50 dark:bg-neutral-900/40" : ""
      }`}
      style={{ height, ...style }}
    >
      {columnWidths.map((width, i) => (
        <div
          key={i}
          role="cell"
          className="shrink-0 px-3"
          style={{ width }}
        >
          <div
            className="h-3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"
            /* anchos irregulares para que no parezca una rejilla perfecta */
            style={{ width: `${55 + ((i * 37) % 40)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export default SkeletonRow;
