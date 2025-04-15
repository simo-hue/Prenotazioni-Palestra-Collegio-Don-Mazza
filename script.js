document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      locale: 'it',
      selectable: true, // Permette la selezione con click
      selectMirror: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      slotMinTime: '08:00:00',
      slotMaxTime: '22:00:00',
      allDaySlot: false,
  
      // Eventi già presenti (finti)
      events: [
        {
          title: 'Prenotato da Marco',
          start: '2025-04-16T15:00:00',
          end: '2025-04-16T16:00:00'
        }
      ],
  
      // ⬇️ Quando clicchi per selezionare uno slot
      select: function(info) {
        const overlappingEvents = calendar.getEvents().filter(event => {
          return (
            event.start < info.end &&
            event.end > info.start
          );
        });
      
        if (overlappingEvents.length >= 3) {
          alert("Massimo 3 persone possono prenotare in questo orario.");
          calendar.unselect();
          return;
        }
      
        const userName = prompt("Inserisci il tuo nome per prenotare:");
        if (userName) {
          calendar.addEvent({
            title: `Prenotato da ${userName}`,
            start: info.start,
            end: info.end
          });
        }
        calendar.unselect();
      }
    });
  
    calendar.render();
  });