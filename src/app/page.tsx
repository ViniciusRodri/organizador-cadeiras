'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { PeopleList } from '../components/PeopleList';
import { SeatingChart } from '../components/SeatingChart';
import { useSeatingData } from '../hooks/useSeatingData';

export default function Home() {
  const {
    seats,
    getPersonById,
    getAvailablePeople,
    removePerson,
    updatePersonName,
    addPerson,
    assignPersonToSeat,
    removePersonFromSeat,
    isLoaded,
  } = useSeatingData();

  const [newPersonName, setNewPersonName] = useState('');
  const [isAddingPerson, setIsAddingPerson] = useState(false);

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim());
      setNewPersonName('');
      setIsAddingPerson(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (destination.droppableId.startsWith('seat-')) {
      const personId = result.draggableId;
      const seatId = destination.droppableId;
      assignPersonToSeat(personId, seatId);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-xl md:text-2xl font-semibold text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Lista de Pessoas - Aparece PRIMEIRO no mobile */}
            <div className="order-1 lg:order-2 lg:col-span-1 space-y-4 md:space-y-6">
              <PeopleList
                people={getAvailablePeople()}
                onRemovePerson={removePerson}
                onUpdateName={updatePersonName}
              />

              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
                  Adicionar Pessoa
                </h3>

                {isAddingPerson ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddPerson();
                        if (e.key === 'Escape') {
                          setIsAddingPerson(false);
                          setNewPersonName('');
                        }
                      }}
                      placeholder="Nome da pessoa..."
                      className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddPerson}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg 
                                 hover:bg-blue-600 transition-colors font-medium text-sm md:text-base"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingPerson(false);
                          setNewPersonName('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg 
                                 hover:bg-gray-300 transition-colors font-medium text-sm md:text-base"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingPerson(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                             px-4 py-3 md:px-6 md:py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 
                             transition-all duration-200 font-medium flex items-center 
                             justify-center gap-2 shadow-lg text-sm md:text-base"
                  >
                    <Plus size={18} className="md:w-5 md:h-5" />
                    Nova Pessoa
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mapa de Assentos - Aparece DEPOIS no mobile */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <SeatingChart
                seats={seats}
                getPersonById={getPersonById}
                assignPersonToSeat={assignPersonToSeat}
                removePersonFromSeat={removePersonFromSeat}
                getAvailablePeople={getAvailablePeople}
              />
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}