import * as Comlink from 'comlink'

const api = {
 procesarDatos: (data: number | null): number | null => {
    if (!data || data <= 0) return null
  let numbers = data
  for (let i = 0; i < 3500000000; i++) {
  numbers += i
  }

  return numbers * 2
 }
}

export type CalculatorWorker = typeof api;

Comlink.expose(api)