import React from 'react'
import { RowSkeleton } from './RowSkeleton'

type TablaParquetSkeletonProps = {
    /** Cuántas filas falsas pintar. Con 80px de alto, ~12 llenan el 85dvh. */
    rows?: number
    /** Alto de fila. Debe coincidir con estimateSize() de la tabla real. */
    rowHeight?: number
}

const HEADERS = [
    'Distancia:',
    'Tarifa:',
    'Propina:',
    'Tiempo:',
    'Hora de recogida',
    'Hora de llegada:',
    'Pasajeros:',
    'Tipo de pago:',
]

/**
 * Skeleton de la pantalla entera: filtros + cabecera + cuerpo de la tabla.
 * Se muestra mientras TablaParquet aún no tiene el primer lote de datos.
 */
export const TablaParquetSkeleton: React.FC<TablaParquetSkeletonProps> = ({
    rows = 12,
    rowHeight = 80,
}) => {
    return (
        <div aria-busy="true" aria-live="polite" className="w-full flex flex-col items-center">
            {/* Filtro de pago mínimo */}
            <div className="w-[85dvw] flex flex-col gap-2 mb-2">
                <div className="h-4 w-56 rounded bg-slate-700/60 animate-pulse" />
                <div className="h-4 w-10 rounded bg-slate-800 animate-pulse" />
                <div className="h-2 w-40 rounded-full bg-slate-700/60 animate-pulse" />
            </div>

            {/* Slider de distancia */}
            <div className="w-[85dvw]" style={{ padding: 20 }}>
                <div className="h-2 w-[300px] rounded-full bg-slate-700/60 animate-pulse" />
            </div>

            {/* Título "Viajes con Propina (n)" */}
            <div className="h-7 w-64 rounded bg-slate-700/60 animate-pulse my-2" />

            {/* Cabecera de columnas: texto real, no hace falta ocultarlo */}
            <div className="hidden md:grid grid-cols-8 gap-4 w-[85dvw] px-7 my-2 text-slate-500">
                {HEADERS.map((h) => (
                    <div key={h}>{h}</div>
                ))}
            </div>

            {/* Cuerpo: mismas medidas que el contenedor scrollable real */}
            <div className="scrollbar-gutter-both relative h-[85dvh] w-[85dvw] overflow-hidden">

                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        className="border-b border-slate-800"
                        style={{
                            height: `${rowHeight}px`,
                            // se desvanecen hacia abajo: sugiere que hay más
                            opacity: Math.max(0.2, 1 - i / rows),
                        }}
                    >
                        <RowSkeleton index={i} />
                    </div>
                ))}
            </div>

            <span className="sr-only">Cargando datos desde Parquet con DuckDB…</span>
        </div>
    )
}

export default TablaParquetSkeleton
