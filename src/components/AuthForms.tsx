
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

type FormMode = "login" | "register";

const AuthForms: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<FormMode>("login");
  const { login, register } = useAuth();
  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm();

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(data.username, data.password);
      } else {
        await register(data.username, data.password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Accedi" : "Registrati"}</CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Accedi per prenotare la palestra" 
            : "Crea un nuovo account per prenotare la palestra"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Inserisci il tuo username"
              {...registerField("username", { 
                required: "Username obbligatorio",
                minLength: { value: 3, message: "Minimo 3 caratteri" }
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Inserisci la tua password"
              {...registerField("password", { 
                required: "Password obbligatoria",
                minLength: { value: 6, message: "Minimo 6 caratteri" }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message as string}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Caricamento..." : mode === "login" ? "Accedi" : "Registrati"}
          </Button>
          
          <Button type="button" variant="ghost" onClick={switchMode} disabled={isLoading}>
            {mode === "login" 
              ? "Non hai un account? Registrati" 
              : "Hai già un account? Accedi"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForms;
