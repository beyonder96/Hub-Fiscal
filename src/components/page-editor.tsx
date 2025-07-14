
"use client";

import { useState, useEffect, useRef } from "react";
import type { ManualPage } from "@/lib/definitions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Save, Trash2, Clock, Paperclip, Image, Download, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface PageEditorProps {
  page: ManualPage;
  onSave: (pageId: string, title: string, content: string) => void;
  onDelete: (pageId: string) => void;
}

const EditorToolbarButton = ({ onClick, children, tip }: { onClick: (e: React.MouseEvent) => void, children: React.ReactNode, tip: string }) => (
    <Button
        type="button"
        variant="ghost"
        size="icon"
        onMouseDown={onClick}
        title={tip}
        className="h-8 w-8"
    >
        {children}
    </Button>
);

// Function to insert HTML at the cursor's position in a contentEditable div
const insertHtmlAtCursor = (html: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const el = document.createElement("div");
    el.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node, lastNode;
    while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

export function PageEditor({ page, onSave, onDelete }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
    if (editorRef.current) {
        editorRef.current.innerHTML = page.content;
    }
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
    const editorContent = editorRef.current?.innerHTML || "";
    onSave(page.id, title, editorContent);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
      const items = event.clipboardData.items;
      for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
              const file = item.getAsFile();
              if (!file) continue;
              const reader = new FileReader();
              reader.onload = (e) => {
                  const src = e.target?.result as string;
                  const imgHtml = `<img src="${src}" style="max-width: 100%; height: auto; border-radius: 8px;" />`;
                  insertHtmlAtCursor(imgHtml);
              };
              reader.readAsDataURL(file);
              event.preventDefault();
          }
      }
  };

  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const attachmentHtml = `
              <a href="${dataUrl}" download="${file.name}" style="display: inline-flex; align-items: center; background-color: #f0f0f0; border: 1px solid #ccc; padding: 8px 12px; border-radius: 8px; text-decoration: none; color: #333; font-family: sans-serif;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span style="margin-left: 8px;">${file.name}</span>
              </a>
          `;
          insertHtmlAtCursor(attachmentHtml);
      };
      reader.readAsDataURL(file);
      // Reset file input
      event.target.value = '';
  };

  const lastUpdated = `Última atualização em ${format(new Date(page.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };
  
  const handleEditorClick = (e: React.MouseEvent<HTMLButtonElement>, command: string, value?: string) => {
      e.preventDefault(); // Prevent editor from losing focus
      execCmd(command, value);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex-shrink-0 p-3 border-b flex flex-wrap justify-between items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da Página"
          className="text-lg font-bold border-none focus-visible:ring-0 shadow-none flex-grow min-w-[200px]"
        />
        <div className="flex items-center gap-2 flex-wrap justify-end flex-grow">
          <p className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mr-auto">
            <Clock className="h-3 w-3" />
            {lastUpdated}
          </p>
          <input type="file" ref={fileInputRef} onChange={handleAttachFile} className="hidden" />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="mr-2" /> Anexar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-9 w-9">
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

      <div className="flex-shrink-0 p-1.5 border-b flex flex-wrap items-center gap-1">
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'undo')} tip="Desfazer (Ctrl+Z)"><Undo /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'redo')} tip="Refazer (Ctrl+Y)"><Redo /></EditorToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'formatBlock', 'h1')} tip="Título 1"><Heading1 /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'formatBlock', 'h2')} tip="Título 2"><Heading2 /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'formatBlock', 'h3')} tip="Título 3"><Heading3 /></EditorToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'bold')} tip="Negrito (Ctrl+B)"><Bold /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'italic')} tip="Itálico (Ctrl+I)"><Italic /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'underline')} tip="Sublinhado (Ctrl+U)"><Underline /></EditorToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'insertUnorderedList')} tip="Lista com Marcadores"><List /></EditorToolbarButton>
          <EditorToolbarButton onClick={(e) => handleEditorClick(e, 'insertOrderedList')} tip="Lista Numerada"><ListOrdered /></EditorToolbarButton>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
            ref={editorRef}
            contentEditable
            onPaste={handlePaste}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: content }}
            className={cn(
              "prose dark:prose-invert max-w-none focus:outline-none p-4 w-full h-full",
              "text-base ring-offset-background placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
        >
        </div>
      </div>
    </div>
  );
}
