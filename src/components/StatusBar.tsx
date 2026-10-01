
import { useEffect, useState } from "react";
import { formatInteger } from "../lib/format";
import type { Phase } from "../types";

const phaseLabels: Record<Phase, string> = {
  engine: 'Starting database engine...',
  query: 'Loading 3.7M trips...',
  ready: 'System ready'
};


export function StatusBar({
  totalCount,
  firstIndex,
  lastIndex,
  tiempoTotal,
  error,
  loading,
  tripsArrLength,
  phase
}: {
  totalCount: number;
  firstIndex: number;
  lastIndex: number;
  tiempoTotal: number | null;
  error: string | null;
  loading: boolean;
  tripsArrLength: number;
  phase: Phase
}) {

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (phase === 'ready') return
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [phase])

  if (error) return <h2 className="text-red-400">{error}</h2>;
  if (loading && tripsArrLength === 0)
    return <h2 className="text-slate-300">{phaseLabels[phase]} {seconds}s</h2>;


  return totalCount === 0 ? (
    <h2 className="hidden md:block">No trips match these filters</h2>
  ) : (
    <h2 className="hidden md:block">
      Showing rows {formatInteger(firstIndex + 1)} to{" "}
      {formatInteger(lastIndex + 1)} of <i> {formatInteger(totalCount)}</i> in{" "}
      {formatInteger(tiempoTotal as number)}ms
    </h2>
  );
}
