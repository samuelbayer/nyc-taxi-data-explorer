import './App.css'
import * as Comlink from 'comlink'
import { useRef, useEffect } from 'react'
import { type CalculatorWorker } from './workers/mathWorker'
import { TablaParquet } from './tablaParquet'


function App() {

  const apiRef = useRef<Comlink.Remote<CalculatorWorker> | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL('./workers/mathWorker.ts', import.meta.url), {
      type: 'module'
    })
    apiRef.current = Comlink.wrap<CalculatorWorker>(worker)

    return () => worker.terminate()
  }, [])


  return (
    <>
      <header>


      </header>
      <main className="min-h-screen bg-slate-950 px-6 py-3 text-white">
        <h1 className="text-4xl font-bold mb-8">NYC Taxi Data Explorer</h1>
        <p className="text-lg">Este es un ejemplo de cómo usar un Web Worker con Comlink en una aplicación React.</p>
        <div className='flex flex-col justify-center items-center h-full'>
          <TablaParquet />
        </div>

      </main>
    </>
  )
}

export default App
