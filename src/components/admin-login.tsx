
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [adminPassword, setAdminPassword] = useState("admin");

  useEffect(() => {
    const storedPassword = localStorage.getItem("adminPassword");
    if (storedPassword) {
      setAdminPassword(storedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password === adminPassword) {
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo ao Painel Administrativo.",
        });
        onLoginSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Senha incorreta",
          description: "Por favor, tente novamente.",
        });
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto flex items-center justify-center py-24">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
          <CardDescription>
            Por favor, insira a senha para acessar o painel administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Senha"
                className="pl-10 h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-accent to-primary text-white" disabled={isLoading || !password}>
              {isLoading ? "Verificando..." : "Acessar Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
