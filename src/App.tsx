import { TablaParquet } from './tablaParquet'


function App() {

  return (
    <>
      <main className="min-h-screen bg-slate-950 px-6 py-3 text-white">
        <h1 className="text-4xl font-bold mb-8">NYC Taxi Data Explorer</h1>
        <div className='flex flex-col justify-center items-center h-full'>
          <TablaParquet />
        </div>

      </main>
    </>
  )
}

export default App
