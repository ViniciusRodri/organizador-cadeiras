'use client';

import { Droppable } from '@hello-pangea/dnd';
import { SeatRow } from './SeatRow';
import { useState } from 'react';
import { SelectPersonModal } from './SelectPersonModal';
import { Armchair } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seat, Person } from '../types';

interface SeatingChartProps {
  seats: Seat[];
  getPersonById: (personId: string) => Person | undefined;
  assignPersonToSeat: (personId: string, seatId: string) => void;
  removePersonFromSeat: (seatId: string) => void;
  getAvailablePeople: () => Person[];
}

export function SeatingChart({
  seats,
  getPersonById,
  assignPersonToSeat,
  removePersonFromSeat,
  getAvailablePeople,
}: SeatingChartProps) {
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeatId(seatId);
    setIsModalOpen(true);
  };

  const handleSelectPerson = (personId: string) => {
    if (selectedSeatId) {
      assignPersonToSeat(personId, selectedSeatId);
    }
  };

  const getPersonName = (personId: string | undefined) => {
    if (!personId) return undefined;
    return getPersonById(personId)?.name;
  };

  const getOccupiedSeatsCount = () => {
    return seats.filter(s => s.personId).length;
  };

  const selectedSeat = seats.find(s => s.id === selectedSeatId);

  return (
    <>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8 lg:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 
                         flex items-center justify-center gap-2 md:gap-3">
            <Armchair className="text-blue-600 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            <span className="hidden sm:inline">Organizador de Assentos</span>
            <span className="sm:hidden">Assentos</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            {getOccupiedSeatsCount()} de {seats.length} ocupadas
          </p>
        </motion.div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-6 lg:p-8">
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Sala de Assentos</h2>
            <div className="flex gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded"></div>
                <span>Ocupado</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span>Livre</span>
              </div>
            </div>
          </div>

          {/* Container com scroll horizontal no mobile */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="min-w-max md:min-w-0">
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3, 4, 5].map(rowNumber => {
                  const rowSeats = seats.filter(s => s.row === rowNumber);
                  return (
                    <Droppable
                      key={`row-${rowNumber}`}
                      droppableId={`row-${rowNumber}`}
                      direction="horizontal"
                      isDropDisabled
                    >
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          <SeatRow
                            rowNumber={rowNumber}
                            seats={rowSeats}
                            getPersonName={getPersonName}
                            onSeatClick={handleSeatClick}
                            onRemovePerson={removePersonFromSeat}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Droppables invisíveis para as cadeiras */}
          {[1, 2, 3, 4, 5].map(rowNumber => {
            const rowSeats = seats.filter(s => s.row === rowNumber);
            return rowSeats.map(seat => (
              <Droppable key={seat.id} droppableId={seat.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: 'none' }}
                  >
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ));
          })}
        </div>
      </div>

      <SelectPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        people={getAvailablePeople()}
        onSelectPerson={handleSelectPerson}
        seatNumber={
          selectedSeat
            ? `Fileira ${selectedSeat.row} - Cadeira ${selectedSeat.number}`
            : undefined
        }
      />
    </>
  );
}