'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { User, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Person } from '../types';

interface PeopleListProps {
  people: Person[];
  onRemovePerson: (personId: string) => void;
  onUpdateName: (personId: string, newName: string) => void;
}

export function PeopleList({ people, onRemovePerson, onUpdateName }: PeopleListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (person: Person) => {
    setEditingId(person.id);
    setEditName(person.name);
  };

  const saveEdit = (personId: string) => {
    if (editName.trim()) {
      onUpdateName(personId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
        <User className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
        <span className="hidden sm:inline">Pessoas Disponíveis ({people.length})</span>
        <span className="sm:hidden">Disponíveis ({people.length})</span>
      </h2>
      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
        Arraste os nomes para as cadeiras ou clique na cadeira
      </p>

      <Droppable droppableId="people-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 min-h-[150px] md:min-h-[200px] p-3 md:p-4 rounded-lg border-2 border-dashed transition-colors ${
              snapshot.isDraggingOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {people.length === 0 ? (
              <p className="text-center text-gray-400 py-6 md:py-8 text-sm md:text-base">
                Todas alocadas! 🎉
              </p>
            ) : (
              people.map((person, index) => (
                <Draggable key={person.id} draggableId={person.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        flex items-center justify-between p-2.5 md:p-3 rounded-lg border-2 
                        transition-all duration-200 group
                        ${
                          snapshot.isDragging
                            ? 'bg-blue-100 border-blue-400 shadow-xl scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }
                      `}
                    >
                      {editingId === person.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveEdit(person.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(person.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1 px-2 py-1 border rounded text-sm md:text-base
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-800 flex-1 text-sm md:text-base">
                          {person.name}
                        </span>
                      )}

                      <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(person)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit2 size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => onRemovePerson(person.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}