
"use client";

import { useState } from "react";
import type { Prestador } from "@/lib/definitions";
import { findPrestador } from "@/lib/prestador-data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building, SearchX } from "lucide-react";

const InfoBox = ({ label, value, className }: { label: string, value?: string, className?: string }) => (
    <div className={className}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-lg font-mono font-semibold text-foreground mt-1 truncate">{value || '---'}</p>
    </div>
);

export function AdminPrestadorLookup() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<Prestador | null>(null);
    const [searched, setSearched] = useState(false);
    const { toast } = useToast();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = findPrestador(query);
        setResult(found || null);
        setSearched(true);
    };

    const handleCheckAuthenticity = () => {
        toast({ title: "Funcionalidade não implementada.", description: "A checagem de autenticidade será adicionada em uma futura versão." });
    };

    const handleGenerateNfts = () => {
        toast({ title: "Funcionalidade não implementada.", description: "A geração de NFTS será adicionada em uma futura versão." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Consulta de Cadastro de Prestador</CardTitle>
                <CardDescription>
                    Digite o nome ou parte do nome da empresa para consultar os dados de cadastro.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="relative flex-grow">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Digite o nome da empresa..."
                            className="pl-10"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Pesquisar
                    </Button>
                </form>

                {searched && !result && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <SearchX className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="font-semibold">Nenhum prestador encontrado</p>
                        <p className="text-sm text-muted-foreground">Verifique o nome digitado e tente novamente.</p>
                    </div>
                )}

                {result && (
                    <div className="border rounded-lg p-4 space-y-4 animate-in fade-in-50 duration-500">
                        <div className="text-center border-b pb-2">
                           <p className="text-sm text-muted-foreground">Nome da Empresa</p>
                           <p className="text-2xl font-bold text-primary">{result.nome}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                            <InfoBox label="Fornecedor" value={result.id} />
                            <InfoBox label="Serviço" value={result.servico} />
                            <InfoBox label="TES" value={result.tes} />
                            <InfoBox label="Conta" value={result.conta} className="md:col-span-2 lg:col-span-1" />
                            <InfoBox label="Vencimento" value={result.vencimento} className="col-span-2 lg:col-span-1" />
                        </div>
                         <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                            <InfoBox label="NFTS" value={result.nfts} />
                            <InfoBox label="ISS" value={result.iss} />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button variant="outline" className="w-full" onClick={handleCheckAuthenticity}>
                                Checar Autenticidade
                            </Button>
                            <Button className="w-full" onClick={handleGenerateNfts}>
                                Gerar NFTS
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
