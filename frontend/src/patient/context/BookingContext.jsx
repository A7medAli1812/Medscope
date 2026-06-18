// src/patient/context/BookingContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext();

/**
 * Provides shared state for the multi-step booking wizard.
 * Steps: Hospital → Specialty → Doctor → Date/Time → Review & Confirm
 */
export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    hospital: null,    // { id, name, ... }
    specialty: null,   // { id, name, ... }
    doctor: null,      // { id, name, specialty, image, ... }
    schedule: null,    // raw schedule data from API
    date: null,        // selected date string
    time: null,        // selected time slot string
    notes: '',         // optional patient notes
  });

  /** Merge partial updates into booking state */
  const updateBooking = useCallback((updates) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  /** Reset all booking data (after successful booking or user navigates away) */
  const resetBooking = useCallback(() => {
    setBooking({
      hospital: null,
      specialty: null,
      doctor: null,
      schedule: null,
      date: null,
      time: null,
      notes: '',
    });
  }, []);

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
};
