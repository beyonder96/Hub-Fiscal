
"use client";

import { BookMarked } from "lucide-react";
import { SidebarContent } from "./sidebar-content";


export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar backdrop-blur-xl glass-effect">
      <div className="flex items-center gap-2 p-4 border-b h-16">
        <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
          <BookMarked className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Sistema Fiscal
        </h1>
      </div>
      <SidebarContent />
      <footer className="p-4 border-t">
         <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sistema Fiscal
        </p>
      </footer>
    </aside>
  );
}
