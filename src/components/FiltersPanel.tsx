import { type Filters } from '../types'
import { ALL_PAYMENT_TYPES, MAX_MILES_DISTANCE } from '../lib/filters'
import { Slider } from 'antd';

export function FiltersPanel({ filters, setFilters }: { filters: Filters, setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  return <>
    <label htmlFor='hide-negative-amounts'>Esconder importes negativos</label>
    <input id='hide-negative-amounts' type='checkbox' checked={filters.hideNegativeFare} onChange={e => setFilters(prev => ({ ...prev, hideNegativeFare: e.target.checked }))}></input>
    <label htmlFor="payment-range">Filtro de minimo de pago:</label>
    <p>${filters.fareAmount}</p>
    <input
      type="range"
      id="payment-range"
      min="0"
      max="1000"
      step="1"
      value={filters.fareAmount}
      style={{ width: '300px' }}
      onChange={e => setFilters(prev => ({ ...prev, fareAmount: Number(e.target.value) }))}
    />
    <label htmlFor='type-payment'>Tipo de pago</label>
    <select id='type-payment' value={filters.paymentType} onChange={(e) => setFilters(prev => ({ ...prev, paymentType: Number(e.target.value) }))} className='text-white bg-gray-900' style={{ color: 'white' }} >
      <option value={ALL_PAYMENT_TYPES}>Sin filtro</option>
      <option value="0">Flex Fare trip</option>
      <option value="1">Credit card</option>
      <option value="2">Cash</option>
      <option value="3">No charge</option>
      <option value="4">Dispute</option>
      <option value="5">Unknown</option>
      <option value="6">Voided trip</option>
    </select>
    <label htmlFor='number-passengers'>Cantidad de pasajeros a partir de: {filters.passengerNumber}</label>
    <input type="range"
      id="number-passengers"
      min="0"
      max="9"
      step="1"
      value={filters.passengerNumber}
      style={{ width: '300px' }}
      onChange={e => setFilters(prev => ({ ...prev, passengerNumber: Number(e.target.value) }))}></input>
    <div style={{ width: 350, padding: 20 }}>
      <label htmlFor='miles-range'>Filtro de distancia en millas: {filters.milesDistance[0]} - {filters.milesDistance[1]}</label>
      <Slider range
        id='miles-range'
        value={filters.milesDistance}
        onChange={(valor) => setFilters(prev => ({ ...prev, milesDistance: valor }))}
        max={MAX_MILES_DISTANCE} />
    </div>
  </>
}