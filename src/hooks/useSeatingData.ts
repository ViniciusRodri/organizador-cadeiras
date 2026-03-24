'use client';

import { useState, useEffect } from 'react';
import { Person, Seat } from '../types';

const STORAGE_KEY = 'seating-data';

export function useSeatingData() {
  const [people, setPeople] = useState<Person[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Inicializar cadeiras (5 fileiras x 10 cadeiras = 50 cadeiras)
  useEffect(() => {
    const initialSeats: Seat[] = [];
    for (let row = 1; row <= 5; row++) {
      for (let number = 1; number <= 10; number++) {
        initialSeats.push({
          id: `seat-${row}-${number}`,
          row,
          number,
        });
      }
    }

    // Carregar do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { people: storedPeople, seats: storedSeats } = JSON.parse(stored);
      setPeople(storedPeople);
      setSeats(storedSeats);
    } else {
      setSeats(initialSeats);
      // Pessoas de exemplo
      const examplePeople: Person[] = Array.from({ length: 60 }, (_, i) => ({
        id: `person-${i + 1}`,
        name: `Pessoa ${i + 1}`,
      }));
      setPeople(examplePeople);
    }
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ people, seats }));
    }
  }, [people, seats, isLoaded]);

  const assignPersonToSeat = (personId: string, seatId: string) => {
    // Remover pessoa de qualquer cadeira anterior
    setSeats(prev =>
      prev.map(seat =>
        seat.personId === personId ? { ...seat, personId: undefined } : seat
      )
    );

    // Remover qualquer pessoa da cadeira de destino e atribuir nova
    setSeats(prev =>
      prev.map(seat =>
        seat.id === seatId ? { ...seat, personId } : seat
      )
    );
  };

const removePersonFromSeat = (seatId: string) => {

    setSeats(prev =>
      prev.map(seat =>
        seat.id === seatId ? { ...seat, personId: undefined } : seat
      )
    );
  };

  const addPerson = (name: string) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name,
    };
    setPeople(prev => [...prev, newPerson]);
  };

  const removePerson = (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
    setSeats(prev =>
      prev.map(seat =>
        seat.personId === personId ? { ...seat, personId: undefined } : seat
      )
    );
  };

  const updatePersonName = (personId: string, newName: string) => {
    setPeople(prev =>
      prev.map(p => (p.id === personId ? { ...p, name: newName } : p))
    );
  };

  const getPersonById = (personId: string) => {
    return people.find(p => p.id === personId);
  };

  const getAvailablePeople = () => {
    const assignedPersonIds = new Set(
      seats.filter(s => s.personId).map(s => s.personId)
    );
    return people.filter(p => !assignedPersonIds.has(p.id));
  };

  return {
    people,
    seats,
    assignPersonToSeat,
    removePersonFromSeat,
    addPerson,
    removePerson,
    updatePersonName,
    getPersonById,
    getAvailablePeople,
    isLoaded,
  };
}