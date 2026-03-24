'use client';

import { motion } from 'framer-motion';
import { User, X } from 'lucide-react';
import { Seat as SeatType } from '../types';

interface SeatProps {
  seat: SeatType;
  personName?: string;
  onSeatClick: (seatId: string) => void;
  onRemovePerson?: (seatId: string) => void;
}

export function Seat({
  seat,
  personName,
  onSeatClick,
  onRemovePerson,
}: SeatProps) {
  const isOccupied = !!personName;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <motion.button
        onClick={() => onSeatClick(seat.id)}
        className={`
          relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
          rounded-lg border-2 transition-all duration-200
          flex items-center justify-center text-xs font-medium
          ${
            isOccupied
              ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
              : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOccupied ? (
          <div className="flex flex-col items-center gap-0.5 md:gap-1 px-1">
            <User size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] leading-tight text-center line-clamp-2">
              {personName}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-xs sm:text-sm">{seat.number}</span>
        )}
      </motion.button>

      {isOccupied && onRemovePerson && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePerson(seat.id);
          }}
          className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 
                     bg-red-500 text-white rounded-full p-0.5 md:p-1 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-red-600 shadow-lg z-10"
        >
          <X size={10} className="md:w-3 md:h-3" />
        </button>
      )}
    </motion.div>
  );
}