
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { toast } from "sonner";

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock database di utenti per simulare il backend
const USERS_DB: Record<string, { id: string; username: string; password: string }> = {
  "user1": { id: "user1", username: "admin", password: "admin123" },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simuliamo una chiamata API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verifichiamo se l'utente esiste nel nostro "database"
    const userFound = Object.values(USERS_DB).find(
      user => user.username === username && user.password === password
    );

    if (userFound) {
      const { password: _, ...userWithoutPassword } = userFound;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
      });
      localStorage.setItem("auth", JSON.stringify({ userId: userWithoutPassword.id }));
      toast.success("Login effettuato con successo");
      return true;
    } else {
      toast.error("Credenziali non valide");
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    // Simuliamo una chiamata API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verifichiamo che l'username non sia già in uso
    const usernameExists = Object.values(USERS_DB).some(
      user => user.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
      toast.error("Username già in uso");
      return false;
    }

    // Creiamo un nuovo ID utente
    const newUserId = `user${Object.keys(USERS_DB).length + 1}`;
    
    // Aggiungiamo l'utente al nostro "database"
    USERS_DB[newUserId] = {
      id: newUserId,
      username,
      password,
    };

    toast.success("Registrazione completata con successo");
    
    // Effettuiamo direttamente il login
    const { password: _, ...newUser } = USERS_DB[newUserId];
    setAuthState({
      user: newUser,
      isAuthenticated: true,
    });
    localStorage.setItem("auth", JSON.stringify({ userId: newUser.id }));
    
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("auth");
    toast.info("Logout effettuato");
  };

  // Controllo se c'è una sessione salvata al caricamento
  React.useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const { userId } = JSON.parse(savedAuth);
        const user = USERS_DB[userId];
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          setAuthState({
            user: userWithoutPassword,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
