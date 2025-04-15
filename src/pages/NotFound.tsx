
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-8">Pagina non trovata</p>
      <Button asChild>
        <Link to="/">Torna alla Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
