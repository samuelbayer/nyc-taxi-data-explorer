export interface TaxiTrip {
  pickup: number;
  duration_s: number;
  distance_cent: number;
  fare_cents: number;
  tip_cents: number;
  passengers: number;
  payment_type: number;
}

export interface Filters {
  fareAmount: number;
  milesDistance: number[];
  paymentType: number;
  passengerNumber: number;
  hideNegativeFare: boolean;
}

export type Phase = 'engine' | 'query' | 'ready';
