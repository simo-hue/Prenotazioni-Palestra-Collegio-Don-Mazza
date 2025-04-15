
# 🏋️‍♂️ Sistema di Prenotazione Palestra - Collegio Don Mazza

## 📝 Descrizione
Applicazione web per la gestione delle prenotazioni della palestra interna del Collegio Don Mazza. Progettata per garantire ordine, controllo degli accessi e facilità d'uso, con accesso esclusivo per i residenti connessi alla rete Wi-Fi del collegio.

## ✨ Funzionalità Principali
- **Autenticazione Utenti**
  - Registrazione e login tramite username e password
  - Sistema di autenticazione semplificato
- **Prenotazione Palestra**
  - Limite massimo di 3 persone per slot orario
  - Controllo automatico delle prenotazioni sovrapposte
- **Interfaccia Utente**
  - Calendario per visualizzare prenotazioni esistenti
  - Basato su FullCalendar.js

## 🏗️ Architettura Tecnica
- **Frontend**: HTML statico + FullCalendar.js
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Autenticazione**: Login base con tracciamento stato "loggato"
- **Deploy**: Server locale Linux

## 🔄 Flusso di Utilizzo
1. Accesso dall'app tramite rete Wi-Fi del collegio
2. Registrazione con nome utente e password
3. Login e abilitazione prenotazioni
4. Visualizzazione calendario prenotazioni
5. Selezione slot libero (max 3 utenti)
6. Conferma o ricezione messaggio di errore se slot pieno
7. Possibilità di logout

## 🚀 Sviluppi Futuri
- Implementazione di hash più sicuri
- Autenticazione JWT
- Sistema di logging degli accessi
- Rate limiting
- Sistema di backup e integrità del database

## 🔒 Nota sulla Sicurezza
Accesso limitato ai dispositivi connessi alla rete Wi-Fi del collegio.

---

*Sviluppato con ❤️ per il Collegio Don Mazza*
