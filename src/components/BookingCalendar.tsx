
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { X } from 'lucide-react';

dayjs.locale('it');

interface BookingEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    userId: string;
    username: string;
    bookingId: string;
  };
}

const BookingCalendar: React.FC = () => {
  const { bookings, addBooking, deleteBooking, isSlotAvailable } = useBooking();
  const { authState } = useAuth();
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Converti le prenotazioni in eventi per il calendario
  useEffect(() => {
    const bookingEvents = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.username}`,
      start: booking.startTime,
      end: booking.endTime,
      extendedProps: {
        userId: booking.userId,
        username: booking.username,
        bookingId: booking.id,
      },
    }));
    
    setEvents(bookingEvents);
  }, [bookings]);

  // Quando un utente seleziona uno slot sul calendario
  const handleDateSelect = (selectInfo: any) => {
    if (!authState.isAuthenticated) {
      toast.error("Devi effettuare il login per prenotare");
      return;
    }

    const startTime = selectInfo.start;
    const endTime = selectInfo.end;

    // Verifichiamo che lo slot sia disponibile
    if (!isSlotAvailable(startTime, endTime)) {
      toast.error("Slot non disponibile o già prenotato da te");
      return;
    }

    setSelectedSlot({ start: startTime, end: endTime });
    setIsBookingModalOpen(true);
  };

  // Quando un utente clicca su un evento esistente
  const handleEventClick = (clickInfo: any) => {
    const bookingId = clickInfo.event.extendedProps.bookingId;
    const userId = clickInfo.event.extendedProps.userId;

    // Se è la prenotazione dell'utente, mostra l'opzione per cancellare
    if (authState.isAuthenticated && (authState.user?.id === userId || authState.user?.isAdmin)) {
      setSelectedBookingId(bookingId);
      setIsConfirmingDelete(true);
    }
  };

  // Conferma la prenotazione
  const confirmBooking = async () => {
    if (!selectedSlot) return;

    const success = await addBooking(selectedSlot.start, selectedSlot.end);
    if (success) {
      setIsBookingModalOpen(false);
      setSelectedSlot(null);
    }
  };

  // Cancella la prenotazione
  const confirmDeleteBooking = async () => {
    if (!selectedBookingId) return;

    const success = await deleteBooking(selectedBookingId);
    if (success) {
      setIsConfirmingDelete(false);
      setSelectedBookingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Calendario Prenotazioni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              // Changed allDaySlot to all-day-slot based on FullCalendar docs
              views={{
                timeGrid: {
                  allDaySlot: false
                }
              }}
              selectable={authState.isAuthenticated}
              selectMirror={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              events={events}
              locale="it"
              buttonText={{
                today: 'Oggi',
                month: 'Mese',
                week: 'Settimana',
                day: 'Giorno',
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              height="100%"
              eventContent={(eventInfo) => {
                const isCurrentUserEvent = eventInfo.event.extendedProps.userId === authState.user?.id;
                return (
                  <div className={`p-1 w-full ${isCurrentUserEvent ? 'bg-green-100 border-green-500' : 'bg-blue-50'} 
                    border rounded-md text-xs`}>
                    <div className="font-semibold">{eventInfo.event.title}</div>
                    <div>{eventInfo.timeText}</div>
                    {isCurrentUserEvent && <X size={12} className="ml-auto" />}
                  </div>
                );
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal per confermare la prenotazione */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Prenotazione</DialogTitle>
            <DialogDescription>
              {selectedSlot && (
                <div className="py-4">
                  <p>Desideri prenotare la palestra per il seguente orario?</p>
                  <p className="font-semibold mt-2">
                    {dayjs(selectedSlot.start).format('DD MMMM YYYY')}
                  </p>
                  <p className="text-sm">
                    Dalle {dayjs(selectedSlot.start).format('HH:mm')} alle {dayjs(selectedSlot.end).format('HH:mm')}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Annulla
            </Button>
            <Button onClick={confirmBooking}>
              Conferma Prenotazione
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal per confermare l'eliminazione */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Cancellazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler cancellare questa prenotazione?
              Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBooking}>
              Cancella Prenotazione
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCalendar;
