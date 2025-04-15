from pydantic import BaseModel
from datetime import datetime

# Base per prenotazioni
class ReservationBase(BaseModel):
    start_time: datetime
    end_time: datetime

# Estende ReservationBase per includere anche lo username dell'utente che prenota
class ReservationCreate(ReservationBase):
    username: str

# Schemi utenti
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str
class ReservationCreate(BaseModel):
    username: str
    start_time: datetime
    end_time: datetime


class ReservationCreate(ReservationBase):
    pass


class Reservation(ReservationBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True