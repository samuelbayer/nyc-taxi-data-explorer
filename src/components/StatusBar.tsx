import { formatInteger } from "../lib/format";


export function StatusBar({ totalCount, firstIndex, lastIndex, tiempoTotal, error, loading, tripsArrLength }: { totalCount: number, firstIndex: number, lastIndex: number, tiempoTotal: number | null, error: string | null, loading: boolean, tripsArrLength: number }) {
  if (error) return <h2 className="text-red-400">{error}</h2>;
  if (loading && tripsArrLength === 0) return <h2 className="text-slate-300">Loading...</h2>;

  return (totalCount === 0 ?
    <h2 className="hidden md:grid" >No trips match these filters</h2>
    : <h2 className="hidden md:grid">Showing rows {formatInteger(firstIndex + 1)} to {formatInteger(lastIndex + 1)} of <i> {formatInteger(totalCount)}</i> in {formatInteger(tiempoTotal as number)}ms</h2>
  )

}

