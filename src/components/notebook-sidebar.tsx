
"use client";

import type { Notebook } from "@/lib/definitions";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { PlusCircle, Book, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


interface NotebookSidebarProps {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activePageId: string | null;
  onSelectPage: (notebookId: string, pageId: string) => void;
  onNewPage: (notebookId: string) => void;
}

export function NotebookSidebar({ notebooks, activeNotebookId, activePageId, onSelectPage, onNewPage }: NotebookSidebarProps) {
  if (notebooks.length === 0) {
    return (
        <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum caderno criado.
        </div>
    )
  }
  
  return (
    <ScrollArea className="h-full">
      <Accordion type="multiple" className="w-full" defaultValue={notebooks.map(nb => nb.id)}>
          {notebooks.map(notebook => (
              <AccordionItem key={notebook.id} value={notebook.id}>
                  <AccordionTrigger className="px-4 py-2 text-sm font-semibold hover:bg-muted/50 [&[data-state=open]]:bg-accent/50">
                      <div className="flex items-center gap-2">
                          <Book className="h-4 w-4" />
                          <span className="truncate">{notebook.title}</span>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                      <div className="flex flex-col">
                          {notebook.pages.length > 0 ? notebook.pages.map(page => (
                              <Button
                                  key={page.id}
                                  variant="ghost"
                                  onClick={() => onSelectPage(notebook.id, page.id)}
                                  className={cn(
                                    "w-full justify-start rounded-none pl-8 h-9",
                                    page.id === activePageId && "bg-accent text-accent-foreground"
                                  )}
                              >
                                  <FileText className="mr-2 h-4 w-4" />
                                  <span className="truncate">{page.title}</span>
                              </Button>
                          )) : (
                            <p className="px-8 py-2 text-xs text-muted-foreground">Nenhuma página.</p>
                          )}
                          <Button
                              variant="ghost"
                              onClick={() => onNewPage(notebook.id)}
                              className="w-full justify-start rounded-none pl-8 h-9 text-muted-foreground hover:text-primary"
                          >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Adicionar Página</span>
                          </Button>
                      </div>
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </ScrollArea>
  );
}
