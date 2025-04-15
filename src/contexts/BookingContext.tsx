
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Booking, User } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import dayjs from "dayjs";

interface BookingContextProps {
  bookings: Booking[];
  addBooking: (startTime: Date, endTime: Date) => Promise<boolean>;
  deleteBooking: (bookingId: string) => Promise<boolean>;
  isSlotAvailable: (startTime: Date, endTime: Date) => boolean;
  getUserBookingsForDate: (date: Date) => Booking[];
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

// Mock database delle prenotazioni
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "booking1",
    userId: "user1",
    username: "admin",
    startTime: dayjs().hour(10).minute(0).second(0).toISOString(),
    endTime: dayjs().hour(11).minute(0).second(0).toISOString(),
    createdAt: dayjs().subtract(1, 'day').toISOString()
  }
];

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const { authState } = useAuth();

  useEffect(() => {
    // Qui in futuro potremmo caricare le prenotazioni da API
    // Per ora usiamo quelle di esempio
  }, []);

  const isSlotAvailable = (startTime: Date, endTime: Date): boolean => {
    // Controlliamo che lo slot richiesto non abbia già 3 utenti
    const overlappingBookings = bookings.filter(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      // Verifichiamo se c'è sovrapposizione tra gli slot
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });

    // Estraiamo gli utenti unici che hanno prenotazioni sovrapposte
    const uniqueUsers = new Set(overlappingBookings.map(b => b.userId));
    
    // Verifichiamo che l'utente corrente non abbia già una prenotazione nello stesso slot
    if (authState.user && overlappingBookings.some(b => b.userId === authState.user?.id)) {
      return false;
    }
    
    // Verifichiamo che non ci siano già 3 utenti per quello slot
    return uniqueUsers.size < 3;
  };

  const addBooking = async (startTime: Date, endTime: Date): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.user) {
      toast.error("Devi effettuare il login per prenotare");
      return false;
    }

    // Verifichiamo che lo slot sia disponibile
    if (!isSlotAvailable(startTime, endTime)) {
      toast.error("Slot non disponibile o già prenotato");
      return false;
    }

    // Simuliamo una chiamata API
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBooking: Booking = {
      id: `booking${bookings.length + 1}`,
      userId: authState.user.id,
      username: authState.user.username,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    toast.success("Prenotazione effettuata con successo");
    return true;
  };

  const deleteBooking = async (bookingId: string): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.user) {
      toast.error("Devi effettuare il login");
      return false;
    }

    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      toast.error("Prenotazione non trovata");
      return false;
    }

    // Verifichiamo che sia la prenotazione dell'utente corrente
    if (booking.userId !== authState.user.id && !authState.user.isAdmin) {
      toast.error("Non puoi eliminare le prenotazioni di altri utenti");
      return false;
    }

    // Simuliamo una chiamata API
    await new Promise(resolve => setTimeout(resolve, 500));

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    toast.success("Prenotazione cancellata");
    return true;
  };

  const getUserBookingsForDate = (date: Date): Booking[] => {
    if (!authState.user) return [];

    // Filtra le prenotazioni dell'utente per la data specificata
    const selectedDate = dayjs(date).format('YYYY-MM-DD');
    
    return bookings.filter(booking => {
      const bookingDate = dayjs(booking.startTime).format('YYYY-MM-DD');
      return bookingDate === selectedDate && booking.userId === authState.user?.id;
    });
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      addBooking, 
      deleteBooking, 
      isSlotAvailable,
      getUserBookingsForDate
    }}>
      {children}
    </BookingContext.Provider>
  );
};
