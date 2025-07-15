
"use client";

import { BookMarked, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarContent } from "./sidebar-content";
import { Button } from "./ui/button";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col border-r bg-background/60 backdrop-blur-xl glass-effect transition-all duration-300 ease-in-out" style={{ width: isCollapsed ? '5rem' : '16rem' }}>
      <div className="flex items-center gap-2 p-4 border-b h-16 shrink-0">
        <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
          <BookMarked className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && (
            <h1 className="text-xl font-bold text-foreground">
            Sistema Fiscal
            </h1>
        )}
      </div>
      <SidebarContent isCollapsed={isCollapsed} />
      <footer className="p-2 border-t mt-auto">
         <Button variant="ghost" className="w-full justify-center" onClick={onToggle}>
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            <span className="sr-only">Toggle Sidebar</span>
         </Button>
      </footer>
    </aside>
  );
}
