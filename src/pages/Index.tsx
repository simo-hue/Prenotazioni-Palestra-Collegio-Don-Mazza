
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import Navbar from "@/components/Navbar";
import AuthForms from "@/components/AuthForms";
import BookingCalendar from "@/components/BookingCalendar";
import { useAuth } from "@/contexts/AuthContext";

const HomeContent: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {!authState.isAuthenticated ? (
          <>
            <div className="md:col-span-5 lg:col-span-4">
              <AuthForms />
            </div>
            
            <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Sistema di Prenotazione Palestra</h2>
                <p className="mb-4">
                  Benvenuto nel sistema di prenotazione della palestra del Collegio Don Mazza.
                  Per prenotare uno slot, è necessario effettuare il login o registrarsi.
                </p>
                <h3 className="text-lg font-semibold mb-2">Regole di utilizzo:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Massimo 3 persone contemporaneamente per fascia oraria</li>
                  <li>Ogni utente può prenotare un solo slot alla volta per ciascuna data</li>
                  <li>È possibile disdire la propria prenotazione fino a 2 ore prima</li>
                  <li>Rispettare gli orari di apertura e chiusura (8:00 - 22:00)</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <BookingCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <HomeContent />
          </main>
          <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
            <div className="container mx-auto">
              © {new Date().getFullYear()} Sistema di Prenotazione Palestra - Collegio Don Mazza
            </div>
          </footer>
        </div>
      </BookingProvider>
    </AuthProvider>
  );
};

export default Index;
