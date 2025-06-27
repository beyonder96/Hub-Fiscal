import { BookMarked, Calculator, FileText, Shield, UserCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-2 px-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
              <BookMarked className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              Sistema Fiscal
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button asChild variant="secondary">
              <Link href="#">
                <FileText className="h-4 w-4 mr-2" />
                Chamados
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#">
                <Calculator className="h-4 w-4 mr-2" />
                Consulta Alíquota
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#">
                <UserCheck className="h-4 w-4 mr-2" />
                Meus Chamados
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full" />
        </div>
      </div>
    </header>
  );
}
