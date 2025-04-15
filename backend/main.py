from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal, engine
from models import Base, User, Reservation
from pydantic import BaseModel
import hashlib
from sqlalchemy.orm import joinedload
from schemas import UserBase
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

logged_in_user = None


app = FastAPI()
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# 🔓 Aggiungi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o limita a ["http://localhost:8000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemi per input/output
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ReservationBase(BaseModel):
    start_time: datetime
    end_time: datetime

class ReservationCreate(ReservationBase):
    username: str

class LoginData(BaseModel):
    username: str
    password: str
    
# Registrazione
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username già esistente.")
    new_user = User(username=user.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "Utente registrato con successo!"}

# Login (basic check)
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    global logged_in_user
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = db.query(User).filter(User.username == user.username, User.password == hashed_password).first()
    if db_user:
        logged_in_user = db_user.username
        return {"message": "Login effettuato con successo", "username": logged_in_user}
    else:
        return JSONResponse(status_code=401, content={"message": "Credenziali non valide"})

@app.get("/logged_in")
def is_logged_in():
    if logged_in_user:
        return {"logged_in": True, "username": logged_in_user}
    return {"logged_in": False}

@app.post("/logout")
def logout():
    global logged_in_user
    logged_in_user = None
    return {"message": "Logout effettuato"}

@app.post("/reserve")
def reserve(res: ReservationCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == res.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato.")

    # Controlla prenotazioni sovrapposte
    overlapping = db.query(Reservation).filter(
        Reservation.start_time < res.end_time,
        Reservation.end_time > res.start_time
    ).count()

    if overlapping >= 3:
        raise HTTPException(status_code=400, detail="Massimo 3 persone già prenotate per questo slot.")

    new_res = Reservation(start_time=res.start_time, end_time=res.end_time, user_id=user.id)
    db.add(new_res)
    db.commit()
    return {"msg": "Prenotazione effettuata!"}

# Elenco prenotazioni
@app.get("/reservations")
def get_reservations(db: Session = Depends(get_db)):
    reservations = db.query(Reservation).options(joinedload(Reservation.user)).all()
    return [
        {
            "id": r.id,
            "user": r.user.username if r.user else "Utente sconosciuto",
            "start_time": r.start_time,
            "end_time": r.end_time
        }
        for r in reservations
    ]