
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell } from "lucide-react";

const Navbar: React.FC = () => {
  const { authState, logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          <h1 className="text-xl font-bold">Palestra Don Mazza</h1>
        </div>
        
        <div>
          {authState.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                Ciao, <span className="font-semibold">{authState.user?.username}</span>
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <span className="text-sm text-muted-foreground">
                Effettua il login per prenotare
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
