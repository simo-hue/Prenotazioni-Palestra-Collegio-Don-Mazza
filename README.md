# 🏋️‍♂️ Lovable – Sistema di Prenotazione Palestra per il Collegio Don Mazza

**Lovable** è un'applicazione web progettata per gestire le prenotazioni della palestra interna del Collegio Don Mazza, garantendo ordine, controllo degli accessi e facilità d’uso. Pensata per l’utilizzo esclusivo da parte dei residenti connessi alla rete Wi-Fi del collegio, Lovable consente la registrazione, il login e la prenotazione di slot orari limitati a un massimo di 3 utenti per fascia oraria.

---

## ⚙️ Funzionalità principali

- ✅ Registrazione e login degli utenti tramite username e password.
- 🔐 Sistema di autenticazione semplificato, con controllo dello stato "loggato".
- 🕒 Prenotazione di fasce orarie per l’uso della palestra, con un **limite massimo di 3 persone per slot**.
- 🚫 Controllo automatico delle prenotazioni sovrapposte.
- 📅 Interfaccia utente con calendario (FullCalendar.js) per visualizzare le prenotazioni esistenti.
- 🌐 Accesso limitato ai soli dispositivi connessi alla rete Wi-Fi del collegio (da implementare).
- 📂 Frontend statico servito direttamente dal backend FastAPI.
- 🐘 Integrazione con PostgreSQL per la persistenza dei dati.
- 🔒 Sicurezza migliorabile in step successivi (hash robusti, autenticazione JWT, logging, rate limiting).
- 💾 Sistema di backup e integrità del database previsto per versioni future.

---

## 🏗️ Architettura tecnica

| Componente   | Tecnologia            |
|--------------|-----------------------|
| Frontend     | HTML + FullCalendar.js|
| Backend      | FastAPI (Python)      |
| Database     | PostgreSQL            |
| ORM          | SQLAlchemy            |
| Autenticazione | Stato utente "loggato" |
| Hosting      | Server Linux locale   |

---

## 🚀 Scenari d'uso

1. 📶 Lo studente accede all'app dalla rete Wi-Fi del collegio.
2. 🧾 Si registra con un nome utente e una password.
3. 🔑 Effettua il login ed è ora abilitato a prenotare.
4. 🗓️ Visualizza il calendario con le prenotazioni già effettuate.
5. ✅ Se trova uno slot libero (meno di 3 utenti), effettua la prenotazione.
6. ⚠️ Se lo slot è già pieno, riceve un messaggio di errore.
7. 🔓 Può disconnettersi tramite il tasto "logout".

---

## 📁 Struttura del progetto

```
Prenotazioni-Palestra-Collegio-Don-Mazza/
├── backend/
│   ├── main.py            # Entrypoint FastAPI
│   ├── models.py          # Modelli SQLAlchemy
│   ├── schemas.py         # Schemi Pydantic
│   ├── database.py        # Configurazione DB
│   └── ...
├── static/
│   └── index.html         # Frontend HTML + FullCalendar
├── README.md
└── requirements.txt
```

---

## 📦 Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuo-utente/lovable.git
cd lovable
```
2. Crea un virtual environment e attivalo:
```bash
python3 -m venv venv
source venv/bin/activate  # oppure venv\Scripts\activate su Windows
```
3. Installa le dipendenze:
```bash
pip install -r requirements.txt
```
4. Configura il database PostgreSQL e aggiorna `database.py` con le credenziali.
5. Avvia il server:
```bash
cd backend
uvicorn main:app --reload
```

---

## ✅ TODO (prossimi step)

- [ ] Aggiunta di autenticazione più sicura (JWT o sessioni)
- [ ] Sistema di backup automatico del database
- [ ] Limiti IP o accesso solo tramite rete interna
- [ ] Interfaccia utente migliorata (frontend responsive)
- [ ] Gestione delle prenotazioni ricorrenti o future

---

## 👨‍💻 Autori

Progetto sviluppato con ❤️ da studenti del Collegio Don Mazza.
