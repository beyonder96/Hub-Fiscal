"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Calculator, FileCode, FileText, Search, Shield, Undo2, UserCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainLinks = [
  { href: "/chamados", label: "Abrir Chamado", icon: FileText },
  { href: "/meus-chamados", label: "Meus Chamados", icon: UserCheck },
];

const toolLinks = [
  { href: "/consulta-aliquota", label: "Consulta Alíquota", icon: Calculator },
  { href: "/validador-xml", label: "Validador XML", icon: FileCode },
  { href: "/pesquisa-tes", label: "Pesquisa de TES", icon: Search },
  { href: "/devolucao", label: "Como Fazer Devolução", icon: Undo2 },
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
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button asChild variant={isActive ? "secondary" : "ghost"} key={link.href}>
                  <Link href={link.href}>
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Ferramentas
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {toolLinks.map((link) => (
                   <DropdownMenuItem key={link.href} asChild>
                     <Link href={link.href}>
                        <link.icon className="h-4 w-4 mr-2" />
                        {link.label}
                      </Link>
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
)
