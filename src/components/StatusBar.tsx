import { useEffect, useState } from "react";
import { formatInteger } from "../lib/format";
import type { Phase } from "../types";

const phaseLabels: Record<Phase, string> = {
  engine: "Starting database engine...",
  query: "Loading 3.7M trips...",
  ready: "System ready",
};

export function StatusBar({
  totalCount,
  firstIndex,
  lastIndex,
  queryMs,
  error,
  loading,
  tripsArrLength,
  phase,
  pageStart
}: {
  totalCount: number;
  firstIndex: number;
  lastIndex: number;
  queryMs: number | null;
  error: string | null;
  loading: boolean;
  tripsArrLength: number;
  phase: Phase;
  pageStart: number
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phase === "ready") return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [phase]);

  if (error) return <h2 className="text-red-400">{error}</h2>;
  if (loading && tripsArrLength === 0)
    return (
      <h2 className="text-slate-300">
        {phaseLabels[phase]} {seconds}s
      </h2>
    );

  return totalCount === 0 ? (
    <h2>No trips match these filters</h2>
  ) : (
    <>
      <h2 className="hidden xl:block">
        Showing rows {formatInteger(firstIndex + 1 + pageStart)} to{" "}
        {formatInteger(lastIndex + 1 + pageStart)} of <i> {formatInteger(totalCount)}</i> in{" "}
        {formatInteger(queryMs as number)}ms
      </h2>
      <h2 className="xl:hidden">
        <i>{formatInteger(totalCount)}</i> trips ·{" "}
        {formatInteger(queryMs as number)}ms
      </h2>
    </>
  );
}
