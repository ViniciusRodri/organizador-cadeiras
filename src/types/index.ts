export interface Person {
  id: string;
  name: string;
  seatId?: string;
}

export interface Seat {
  id: string;
  row: number;
  number: number;
  personId?: string;
}