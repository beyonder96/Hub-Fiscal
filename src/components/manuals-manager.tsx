
"use client";

import { useState, useEffect } from "react";
import type { Notebook, ManualPage } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { NotebookSidebar } from "./notebook-sidebar";
import { PageEditor } from "./page-editor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PlusCircle, BookCopy, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ManualsManager() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
    const [isNewNotebookDialogOpen, setIsNewNotebookDialogOpen] = useState(false);
    const [newNotebookTitle, setNewNotebookTitle] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        try {
            const stored = localStorage.getItem("manualsNotebooks");
            if (stored) {
                const parsed = JSON.parse(stored);
                setNotebooks(parsed);
                // Set initial active notebook and page
                if (parsed.length > 0) {
                    const firstNotebook = parsed[0];
                    setActiveNotebookId(firstNotebook.id);
                    if (firstNotebook.pages.length > 0) {
                        setActivePageId(firstNotebook.pages[0].id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load manuals from localStorage", error);
        }
    }, []);

    const saveNotebooks = (updatedNotebooks: Notebook[]) => {
        setNotebooks(updatedNotebooks);
        localStorage.setItem("manualsNotebooks", JSON.stringify(updatedNotebooks));
    };

    const handleNewNotebook = () => {
        if (!newNotebookTitle.trim()) {
            toast({ variant: 'destructive', title: "Título é obrigatório." });
            return;
        }

        const newNotebook: Notebook = {
            id: `nb-${Date.now()}`,
            title: newNotebookTitle,
            createdAt: new Date().toISOString(),
            pages: [],
        };

        const updatedNotebooks = [...notebooks, newNotebook];
        saveNotebooks(updatedNotebooks);
        setNewNotebookTitle("");
        setIsNewNotebookDialogOpen(false);
        setActiveNotebookId(newNotebook.id);
        setActivePageId(null);
        toast({ title: "Caderno criado com sucesso!" });
    };

    const handleNewPage = (notebookId: string) => {
        const now = new Date().toISOString();
        const newPage: ManualPage = {
            id: `page-${Date.now()}`,
            title: "Nova Página",
            content: "",
            createdAt: now,
            updatedAt: now,
        };

        const updatedNotebooks = notebooks.map(nb => {
            if (nb.id === notebookId) {
                return { ...nb, pages: [newPage, ...nb.pages] };
            }
            return nb;
        });

        saveNotebooks(updatedNotebooks);
        setActiveNotebookId(notebookId);
        setActivePageId(newPage.id);
    };

    const handleSelectPage = (notebookId: string, pageId: string) => {
        setActiveNotebookId(notebookId);
        setActivePageId(pageId);
    };

    const handleSavePage = (pageId: string, title: string, content: string) => {
        const updatedNotebooks = notebooks.map(nb => {
            if (nb.id === activeNotebookId) {
                const updatedPages = nb.pages.map(p => {
                    if (p.id === pageId) {
                        return { ...p, title, content, updatedAt: new Date().toISOString() };
                    }
                    return p;
                });
                return { ...nb, pages: updatedPages };
            }
            return nb;
        });
        saveNotebooks(updatedNotebooks);
        toast({ title: "Página salva!" });
    };
    
    const handleDeletePage = (notebookId: string, pageId: string) => {
        let wasActivePageDeleted = activePageId === pageId;

        const updatedNotebooks = notebooks.map(nb => {
            if (nb.id === notebookId) {
                 if (nb.pages.length === 1 && nb.pages[0].id === pageId) {
                    return null; // Mark notebook for deletion
                }
                return { ...nb, pages: nb.pages.filter(p => p.id !== pageId) };
            }
            return nb;
        }).filter(nb => nb !== null) as Notebook[];

        saveNotebooks(updatedNotebooks);
        
        if (wasActivePageDeleted) {
            setActivePageId(null);
            setActiveNotebookId(null);
            if (updatedNotebooks.length > 0) {
                 const firstNb = updatedNotebooks[0];
                 setActiveNotebookId(firstNb.id);
                 if (firstNb.pages.length > 0) {
                     setActivePageId(firstNb.pages[0].id)
                 }
            }
        }
        toast({ variant: "destructive", title: "Página excluída." });
    };

    const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId);
    const activePage = activeNotebook?.pages.find(p => p.id === activePageId);

    return (
        <Card className="h-[70vh] flex flex-col md:flex-row overflow-hidden">
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r">
                <div className="p-2 border-b">
                    <Dialog open={isNewNotebookDialogOpen} onOpenChange={setIsNewNotebookDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full">
                                <PlusCircle className="mr-2" /> Novo Caderno
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Novo Caderno</DialogTitle>
                                <DialogDescription>Dê um nome ao seu novo caderno de manuais.</DialogDescription>
                            </DialogHeader>
                            <Input
                                placeholder="Ex: Procedimentos Fiscais"
                                value={newNotebookTitle}
                                onChange={(e) => setNewNotebookTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNewNotebook()}
                            />
                            <DialogFooter>
                                <Button onClick={handleNewNotebook}>Criar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <NotebookSidebar
                    notebooks={notebooks}
                    activePageId={activePageId}
                    activeNotebookId={activeNotebookId}
                    onSelectPage={handleSelectPage}
                    onNewPage={handleNewPage}
                />
            </aside>
            <main className="flex-1 flex flex-col">
                {activePage ? (
                    <PageEditor
                        key={activePage.id}
                        page={activePage}
                        onSave={handleSavePage}
                        onDelete={(pageId) => handleDeletePage(activeNotebookId!, pageId)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/50">
                        <BookCopy className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">Bem-vindo aos Manuais</h2>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Selecione uma página na barra lateral para começar a ler ou editar. Se não houver cadernos, crie um para começar.
                        </p>
                    </div>
                )}
            </main>
        </Card>
    );
}
