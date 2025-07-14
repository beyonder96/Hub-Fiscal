
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Bot, FileCode, FileSpreadsheet, Search, Shield, Users, BookOpen, GitCommit, LayoutDashboard } from "lucide-react";
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/consulta-aliquota", label: "Consulta Alíquota", icon: Search },
  { href: "/validador-xml", label: "Validador XML", icon: FileCode },
  { href: "/calculo-icms-st", label: "Cálculo ICMS-ST", icon: FileSpreadsheet },
  { href: "/pesquisa-tes", label: "Pesquisa de TES", icon: Bot },
  { href: "/chamados", label: "Consulta Prestador", icon: Users },
  { href: "/manuais", label: "Manuais", icon: BookOpen },
  { href: "/updates", label: "Atualizações", icon: GitCommit },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/manuais") return pathname.startsWith(href);
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background/80 backdrop-blur-xl glass-effect">
      <div className="flex items-center gap-2 p-4 border-b h-16">
        <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
          <BookMarked className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Sistema Fiscal
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <TooltipProvider>
            {navLinks.map((link) => (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                        isActive(link.href) && "bg-primary/10 text-primary font-semibold"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </TooltipProvider>
      </nav>
      <footer className="p-4 border-t">
         <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sistema Fiscal
        </p>
      </footer>
    </aside>
  );
}
