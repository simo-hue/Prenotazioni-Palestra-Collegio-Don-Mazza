document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'it',
    selectable: true,
    selectMirror: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,

    // Carica eventi dal backend
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const res = await fetch("http://127.0.0.1:8000/reservations");
        const data = await res.json();
        const events = data.map(r => ({
          title: `Prenotato da ${r.user}`,
          start: r.start_time,
          end: r.end_time
        }));
        successCallback(events);
      } catch (error) {
        console.error("Errore nel caricamento eventi:", error);
        failureCallback(error);
      }
    },

    // Crea nuova prenotazione al click
    select: async function (info) {
      const username = prompt("Inserisci il tuo username:");
      if (!username) {
        calendar.unselect();
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/reserve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            start_time: info.startStr,
            end_time: info.endStr
          })
        });

        const result = await res.json();

        if (!res.ok) {
          alert("Errore: " + result.detail);
        } else {
          alert("Prenotazione effettuata!");
          calendar.refetchEvents(); // aggiorna il calendario
        }
      } catch (error) {
        alert("Errore di rete o server non raggiungibile.");
        console.error(error);
      }

      calendar.unselect();
    }
  });

  calendar.render();
});