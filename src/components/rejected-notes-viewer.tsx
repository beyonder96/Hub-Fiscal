
"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { RejectedNote } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileWarning, Receipt } from "lucide-react";

export function RejectedNotesViewer() {
  const [notes, setNotes] = useState<RejectedNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    
    const handleStorageChange = () => {
        try {
            const stored = localStorage.getItem("rejectedNotes");
            if (stored) setNotes(JSON.parse(stored));
        } catch (error) {
            console.error("Failed to reload rejected notes on storage event", error);
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
              ) : notes.length > 0 ? (
                notes.map((note) => (
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
                    Nenhuma nota recusada encontrada.
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
