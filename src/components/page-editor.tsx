
"use client";

import { useState, useEffect } from "react";
import type { ManualPage } from "@/lib/definitions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Save, Trash2, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface PageEditorProps {
  page: ManualPage;
  onSave: (pageId: string, title: string, content: string) => void;
  onDelete: (pageId: string) => void;
}

export function PageEditor({ page, onSave, onDelete }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when the page prop changes
    setTitle(page.title);
    setContent(page.content);
  }, [page]);
  
  const handleSave = () => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Título Obrigatório',
        description: 'A página precisa de um título para ser salva.',
      });
      return;
    }
    
    setIsSaving(true);
    onSave(page.id, title, content);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  const lastUpdated = `Última atualização em ${format(new Date(page.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="flex-shrink-0 p-3 border-b flex justify-between items-center gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da Página"
          className="text-lg font-bold border-none focus-visible:ring-0 shadow-none"
        />
        <div className="flex items-center gap-2">
            <p className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lastUpdated}
            </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a página "{page.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(page.id)}>
                  Sim, excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comece a escrever seu manual aqui..."
          className="w-full h-full p-4 border-none rounded-none resize-none focus-visible:ring-0 shadow-none text-base"
        />
      </div>
    </div>
  );
}
