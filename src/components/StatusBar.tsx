import { useEffect, useState } from "react";
import { formatInteger } from "../lib/format";
import type { Phase } from "../types";

const phaseLabels: Record<Phase, string> = {
  engine: "Starting database engine...",
  query: "Loading 3.7M trips...",
  ready: "System ready",
};

const METER = "mb-3 rounded-md bg-meter px-5 py-4 text-cab";

export function StatusBar({
  totalCount,
  firstIndex,
  lastIndex,
  tiempoTotal,
  error,
  loading,
  tripsArrLength,
  phase,
}: {
  totalCount: number;
  firstIndex: number;
  lastIndex: number;
  tiempoTotal: number | null;
  error: string | null;
  loading: boolean;
  tripsArrLength: number;
  phase: Phase;
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

  if (error)
    return (
      <div className={METER}>
        <p className="font-meter text-lg text-[#ffb4ab]">{error}</p>
      </div>
    );
  if (loading && tripsArrLength === 0)
    return (
      <div className={METER}>
        <p className="font-meter text-lg">
          {phaseLabels[phase]} {seconds}s
        </p>
      </div>
    );

  if (totalCount === 0)
    return (
      <div className={METER}>
        <p className="font-meter text-lg">No trips match these filters</p>
        <p className="mt-1 text-sm text-white/70">
          Lower the minimum fare or widen the distance to see trips again.
        </p>
      </div>
    );

  return (
    <div
      className={`${METER} flex flex-wrap items-end justify-between gap-x-10 gap-y-3`}
    >
      <div>
        <p className="font-meter text-4xl font-bold leading-none">
          {formatInteger(totalCount)}
        </p>
        <p className="mt-2 text-sm text-white/70">trips match these filters</p>
      </div>
      <dl className="flex gap-8 text-sm">
        <div className="hidden md:block">
          <dt className="text-white/70">Showing rows</dt>
          <dd className="font-meter text-lg font-medium">
            {formatInteger(firstIndex + 1)} to {formatInteger(lastIndex + 1)}
          </dd>
        </div>
        {tiempoTotal !== null && (
          <div>
            <dt className="text-white/70">Query time</dt>
            <dd className="font-meter text-lg font-medium">
              {formatInteger(tiempoTotal)} ms
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
