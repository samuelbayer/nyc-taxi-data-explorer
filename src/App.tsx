import './App.css'
import * as Comlink from 'comlink'
import { useState, useRef, useEffect } from 'react'
import { type CalculatorWorker } from './workers/mathWorker'


function App() {
  const [value, setValue] = useState<number>(0)
  const [result, setResult] = useState<number | null>(null)

  const apiRef = useRef<Comlink.Remote<CalculatorWorker> | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL('./workers/mathWorker.ts', import.meta.url), {
      type: 'module'
    })
    apiRef.current = Comlink.wrap<CalculatorWorker>(worker)

    return () => worker.terminate()
  }, [])

  const handleClick = async (value: number) => {
    if (!apiRef.current) return;
    if (value <= 0) return
    const result = await apiRef.current.procesarDatos(value)
    setResult(result ?? null)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <h1 className="text-4xl font-bold mb-8">NYC Taxi Data Explorer</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer m-3" onClick={() => handleClick(value)}>Procesar datos</button>
      <input className='border border-gray-400 ' type='number' value={value} onChange={(e) => setValue(Number(e.target.value))} ></input>
      <p className="text-lg mb-4">Resultado del procesamiento de datos: {result}</p>
      <p className="text-lg">Este es un ejemplo de cómo usar un Web Worker con Comlink en una aplicación React.</p>
    </main>
  )
}

export default App
