import React from "react";
import { TRIP_COLUMNS } from "../lib/columns";

type RowSkeletonProps = {
  /** El índice de la fila virtual. Solo se usa para variar los anchos
   *  y que no salgan 8 barras idénticas repetidas en pantalla. */
  index: number;
};

/** Anchos "aleatorios" pero deterministas por celda (0-99). */
function pseudoWidth(index: number, col: number): number {
  const n = (index * 37 + col * 71) % 100;
  return 45 + (n % 45); // entre 45% y 89%
}

export const RowSkeleton: React.FC<RowSkeletonProps> = ({ index }) => {
  return (
    <div
      aria-hidden="true"
      className="p-3 md:py-2 md:px-4 md:grid grid-cols-8 gap-4 items-center h-full"
    >
      {TRIP_COLUMNS.map((_, col) => (
        <div key={col} className="flex items-center justify-center h-full">
          <div
            className="h-3 rounded bg-slate-700/60 animate-pulse"
            style={{ width: `${pseudoWidth(index, col)}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export default RowSkeleton;
