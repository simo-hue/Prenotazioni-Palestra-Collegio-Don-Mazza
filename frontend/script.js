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
        const response = await fetch('http://127.0.0.1:8000/reservations');
        const data = await response.json();
        const events = data.map(res => ({
          title: `Prenotato da ${res.user}`,
          start: res.start_time,
          end: res.end_time
        }));
        successCallback(events);
      } catch (error) {
        alert("Errore nel caricamento delle prenotazioni.");
        failureCallback(error);
      }
    },

    // Quando selezioni uno slot
    select: async function (info) {
      const username = prompt("Inserisci il tuo username:");
      if (!username) {
        calendar.unselect();
        return;
      }

      // Controlla se ci sono già 3 prenotazioni sovrapposte
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

        if (!res.ok) {
          const error = await res.json();
          alert("Errore: " + error.detail);
        } else {
          alert("Prenotazione effettuata!");
          calendar.refetchEvents(); // Ricarica gli eventi dal backend
        }

      } catch (err) {
        alert("Errore nella connessione al server.");
        console.error(err);
      }

      calendar.unselect();
    }
  });

  calendar.render();
});