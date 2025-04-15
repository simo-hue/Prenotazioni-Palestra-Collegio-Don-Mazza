document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      locale: 'it',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      slotMinTime: '08:00:00',
      slotMaxTime: '22:00:00',
      allDaySlot: false,
      events: [
        // Esempio di prenotazione esistente
        {
          title: 'Prenotato da Marco',
          start: '2025-04-16T15:00:00',
          end: '2025-04-16T16:00:00'
        }
      ]
    });
  
    calendar.render();
  });