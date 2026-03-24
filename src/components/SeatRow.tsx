'use client';

import { Seat } from './Seat';
import { Seat as SeatType } from '../types';

interface SeatRowProps {
  rowNumber: number;
  seats: SeatType[];
  getPersonName: (personId: string | undefined) => string | undefined;
  onSeatClick: (seatId: string) => void;
  onRemovePerson: (seatId: string) => void;
}

export function SeatRow({
  rowNumber,
  seats,
  getPersonName,
  onSeatClick,
  onRemovePerson,
}: SeatRowProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
      <div className="w-12 md:w-14 lg:w-16 text-center font-semibold text-gray-700 text-sm md:text-base lg:text-lg flex-shrink-0">
        <span className="hidden sm:inline">Fileira {rowNumber}</span>
        <span className="sm:hidden">F{rowNumber}</span>
      </div>
      <div className="flex gap-1.5 md:gap-2">
        {seats.map(seat => (
          <Seat
            key={seat.id}
            seat={seat}
            personName={getPersonName(seat.personId)}
            onSeatClick={onSeatClick}
            onRemovePerson={onRemovePerson}
          />
        ))}
      </div>
    </div>
  );
}