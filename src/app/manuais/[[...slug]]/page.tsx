
"use client";

import { useState, useEffect } from "react";
import type { Notebook, ManualPage } from "@/lib/definitions";
import { NotebookSidebar } from "@/components/notebook-sidebar";
import { PageViewer } from "@/components/page-viewer";
import { Card } from "@/components/ui/card";
import { BookCopy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function ManuaisPage() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [activePage, setActivePage] = useState<ManualPage | null>(null);
    const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string[] | undefined;

    useEffect(() => {
        try {
            const stored = localStorage.getItem("manualsNotebooks");
            if (stored) {
                const parsed = JSON.parse(stored);
                setNotebooks(parsed);

                let pageIdToFind: string | undefined;

                if (slug?.length === 2 && slug[0] === 'page') {
                    pageIdToFind = slug[1];
                } else if (parsed.length > 0) {
                    const firstNotebook = parsed[0];
                    if (firstNotebook.pages.length > 0) {
                        pageIdToFind = firstNotebook.pages[0].id;
                    }
                }
                
                if (pageIdToFind) {
                    let foundPage: ManualPage | null = null;
                    let foundNotebookId: string | null = null;
                    
                    for (const nb of parsed) {
                        const page = nb.pages.find(p => p.id === pageIdToFind);
                        if (page) {
                            foundPage = page;
                            foundNotebookId = nb.id;
                            break;
                        }
                    }

                    if(foundPage && foundNotebookId) {
                        setActivePage(foundPage);
                        setActiveNotebookId(foundNotebookId);
                         if (!slug || slug.length === 0) {
                             router.replace(`/manuais/page/${foundPage.id}`, { scroll: false });
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load manuals from localStorage", error);
        }
    }, [slug, router]);

    const handleSelectPage = (notebookId: string, pageId: string) => {
        router.push(`/manuais/page/${pageId}`);
    };

    return (
        <Card className="h-[calc(100vh-120px)] flex flex-col md:flex-row overflow-hidden">
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r">
                <NotebookSidebar
                    notebooks={notebooks}
                    activePageId={activePage?.id || null}
                    activeNotebookId={activeNotebookId}
                    onSelectPage={handleSelectPage}
                    isReadOnly={true}
                />
            </aside>
            <main className="flex-1 flex flex-col">
                {activePage ? (
                    <PageViewer page={activePage} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/50">
                        <BookCopy className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">Manuais do Sistema</h2>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Selecione uma página na barra lateral para começar a ler.
                        </p>
                    </div>
                )}
            </main>
        </Card>
    );
}
