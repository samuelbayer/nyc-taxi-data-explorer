import React from "react";
import { JUSTIFY_CLASS, TRIP_COLUMNS, TRIP_GRID_STYLE } from "../lib/columns";
import { CARD_HEIGHT } from "./TripCard";

type RowSkeletonProps = {
  index: number;
};

function pseudoWidth(index: number, col: number): number {
  const n = (index * 37 + col * 71) % 100;
  return 45 + (n % 45); // 45%-89%
}

export const RowSkeleton: React.FC<RowSkeletonProps> = ({ index }) => {
  return (
    <>
      <div
        aria-hidden="true"
        className="hidden p-3 md:py-2 md:px-4 md:grid gap-6 items-center h-full"
        style={TRIP_GRID_STYLE}
      >
        {TRIP_COLUMNS.map((col, i) => (
          <div key={i} className={`flex items-center h-full ${JUSTIFY_CLASS[col.align]}`}>
            <div
              className="h-3 rounded bg-rule animate-pulse"
              style={{ width: `${pseudoWidth(index, i)}%` }}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="md:hidden px-2 py-3"
        style={{ height: CARD_HEIGHT }}
      >
        <div className='h-full bg-white rounded-md grid-cols-2 grid gap-6 p-4 border border-rule'>
          {TRIP_COLUMNS.map((_, col) => (
            <div key={col} className="flex flex-col gap-2">
              <div className="h-2 w-1/3 rounded bg-rule animate-pulse" />
              <div
                className="h-4 rounded bg-rule animate-pulse"
                style={{ width: `${pseudoWidth(index, col)}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RowSkeleton;
