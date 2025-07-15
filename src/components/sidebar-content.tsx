
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileCode, FileSpreadsheet, Search, Shield, Users, BookOpen, GitCommit, LayoutDashboard, FileWarning } from "lucide-react";
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/consulta-aliquota", label: "Consulta Alíquota", icon: Search },
  { href: "/validador-xml", label: "Validador XML", icon: FileCode },
  { href: "/calculo-icms-st", label: "Cálculo ICMS-ST", icon: FileSpreadsheet },
  { href: "/pesquisa-tes", label: "Pesquisa de TES", icon: Bot },
  { href: "/chamados", label: "Consulta Prestador", icon: Users },
  { href: "/notas-recusadas", label: "Notas Recusadas", icon: FileWarning },
  { href: "/manuais", label: "Manuais", icon: BookOpen },
  { href: "/updates", label: "Atualizações", icon: GitCommit },
  { href: "/admin", label: "Admin", icon: Shield },
];

interface SidebarContentProps {
    isCollapsed: boolean;
}

export function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/manuais") return pathname.startsWith(href);
    return pathname.startsWith(href) && href !== "/";
  };
    
  return (
    <nav className="flex-1 px-2 py-4 space-y-2">
      <TooltipProvider delayDuration={0}>
          {navLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                      isCollapsed ? "justify-center px-2" : "px-3",
                      isActive(link.href) && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span className={cn("truncate", isCollapsed && "hidden")}>{link.label}</span>
                  </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
      </TooltipProvider>
    </nav>
  );
}
