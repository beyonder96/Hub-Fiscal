
"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SimpleCalculator } from './simple-calculator';
import { Calculator, PanelLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SidebarContent } from "./sidebar-content";

export function Header() {
  return (
    <header className="py-2 px-4 border-b sticky top-0 z-40 bg-background/60 backdrop-blur-xl glass-effect h-16 flex items-center">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <PanelLeft />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 pt-8 w-64 bg-background/60 backdrop-blur-xl glass-effect">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Menu Principal</SheetTitle>
                      <SheetDescription>Navegue pelas funcionalidades do sistema.</SheetDescription>
                    </SheetHeader>
                    <SidebarContent isCollapsed={false} />
                </SheetContent>
            </Sheet>
        </div>
        <div className="flex items-center gap-3 ml-auto">
           <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Calculator className="h-5 w-5" />
                   <span className="sr-only">Calculadora</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-none">
                <SimpleCalculator />
              </PopoverContent>
           </Popover>
          <ThemeToggle />
        </div>
    </header>
  );
}
