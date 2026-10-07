import { useEffect, useState } from "react";
import { formatInteger } from "../lib/format";
import type { ErrorCode, Phase } from "../types";
import { useI18n } from "../i18n/context";

const METER =
  "min-h-[7rem] rounded-2xl border border-meter-edge bg-meter px-5 py-4 text-meter-fg";

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
  error: ErrorCode | null;
  loading: boolean;
  tripsArrLength: number;
  phase: Phase;
}) {
  const { t } = useI18n();
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
        <p className="font-meter text-lg text-meter-alert">
          {error === "engine" ? t.status.errorEngine : t.status.errorParquet}
        </p>
      </div>
    );
  if (loading && tripsArrLength === 0)
    return (
      <div className={METER}>
        <p className="font-meter text-lg">
          {t.status[phase]} {seconds}s
        </p>
      </div>
    );

  if (totalCount === 0)
    return (
      <div className={METER}>
        <p className="font-meter text-lg">{t.status.noMatch}</p>
        <p className="mt-1 text-sm text-meter-dim">{t.status.noMatchHint}</p>
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
        <p className="mt-2 text-sm text-meter-dim">{t.status.tripsMatch}</p>
      </div>
      <dl className="flex gap-8 text-sm">
        <div className="hidden md:block">
          <dt className="text-meter-dim">{t.status.showingRows}</dt>
          <dd className="font-meter text-lg font-medium">
            {t.status.rowsRange(
              formatInteger(firstIndex + 1),
              formatInteger(lastIndex + 1),
            )}
          </dd>
        </div>
        {tiempoTotal !== null && (
          <div>
            <dt className="text-meter-dim">{t.status.queryTime}</dt>
            <dd className="font-meter text-lg font-medium">
              {formatInteger(tiempoTotal)} ms
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
