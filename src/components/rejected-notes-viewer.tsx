
"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { RejectedNote } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FileWarning, Receipt, Search, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function RejectedNotesViewer() {
  const [notes, setNotes] = useState<RejectedNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadNotes = () => {
        try {
          const stored = localStorage.getItem("rejectedNotes");
          if (stored) {
            setNotes(JSON.parse(stored));
          }
        } catch (error) {
          console.error("Failed to load rejected notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    loadNotes();
    window.addEventListener('storage', loadNotes);
    return () => window.removeEventListener('storage', loadNotes);
  }, []);

  const filteredNotes = notes.filter(note => 
    note.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.nfeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const showNotFoundAlert = searchQuery && filteredNotes.length === 0 && !isLoading;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-lg">
                <FileWarning className="h-6 w-6 text-destructive" />
            </div>
            <div>
                <CardTitle className="text-2xl font-bold font-headline">Consulta de Notas Recusadas</CardTitle>
                <CardDescription>Visualize o histórico de notas fiscais que foram recusadas.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Pesquisar por fornecedor ou número da nota..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        
        {showNotFoundAlert && (
          <Alert className="mb-4 border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Não encontrou o que procurava?</AlertTitle>
            <AlertDescription>
              Caso não encontre a nota, por favor, procure ajuda do setor de recebimento.
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Nota</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Data Recusa</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Motivo da Recusa</TableHead>
                <TableHead>Vencimentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">Carregando...</TableCell>
                </TableRow>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.nfeNumber}</TableCell>
                    <TableCell>{note.supplierName}</TableCell>
                    <TableCell>{format(parseISO(note.issueDate), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(parseISO(note.rejectionDate), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{note.totalValue}</TableCell>
                    <TableCell className="max-w-[250px] truncate" title={note.rejectionReason}>{note.rejectionReason}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {note.dueDates.map(due => (
                          <li key={due.id}>
                            {format(parseISO(due.date), "dd/MM/yyyy")}: {due.value}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    {searchQuery ? "Nenhum resultado para sua busca." : "Nenhuma nota recusada encontrada."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
