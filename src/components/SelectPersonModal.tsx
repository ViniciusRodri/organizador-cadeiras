'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { Person } from '../types';

interface SelectPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  onSelectPerson: (personId: string) => void;
  seatNumber?: string;
}

export function SelectPersonModal({
  isOpen,
  onClose,
  people,
  onSelectPerson,
  seatNumber,
}: SelectPersonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Selecionar Pessoa {seatNumber && `- ${seatNumber}`}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {people.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Não há pessoas disponíveis
                  </p>
                ) : (
                  <div className="space-y-2">
                    {people.map((person) => (
                      <motion.button
                        key={person.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelectPerson(person.id);
                          onClose();
                        }}
                        className="w-full p-4 text-left rounded-lg border-2 border-gray-200 
                                 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                                 flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 
                                      flex items-center justify-center group-hover:bg-blue-500 
                                      group-hover:text-white transition-colors">
                          <User size={20} />
                        </div>
                        <span className="font-medium text-gray-800 text-lg">
                          {person.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}