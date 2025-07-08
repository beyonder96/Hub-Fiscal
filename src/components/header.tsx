"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Calculator, FileCode, FileSpreadsheet, Search, Shield, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const toolLinks = [
  { href: "/consulta-aliquota", label: "Consulta Alíquota", icon: Calculator },
  { href: "/validador-xml", label: "Validador XML", icon: FileCode },
  { href: "/calculo-icms-st", label: "Cálculo ICMS-ST", icon: FileSpreadsheet },
  { href: "/pesquisa-tes", label: "Pesquisa de TES", icon: Search },
  { href: "/chamados", label: "Consulta Prestador", icon: Users },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="py-2 px-4 border-b sticky top-0 z-40 bg-background/60 backdrop-blur-lg glass-effect">
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
            {toolLinks.map((link) => (
              <Button asChild variant={pathname === link.href ? "secondary" : "ghost"} key={link.href} size="sm">
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
           <Button asChild variant={pathname === "/admin" ? "secondary" : "ghost"}>
              <Link href="/admin">
                <Shield className="h-4 w-4 mr-0 md:mr-2" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
