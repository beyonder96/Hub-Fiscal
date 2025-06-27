"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, CheckCircle, XCircle, Upload, ClipboardPaste } from "lucide-react";
import { Input } from "./ui/input";

export function XmlValidator() {
  const [xmlContent, setXmlContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/xml") {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setXmlContent(evt.target?.result as string);
      };
      reader.readAsText(file);
    } else {
        setFileName("");
        setXmlContent("");
        toast({
            variant: "destructive",
            title: "Arquivo inválido",
            description: "Por favor, selecione um arquivo .xml",
        });
    }
  };

  const handlePaste = async () => {
    try {
        const text = await navigator.clipboard.readText();
        setXmlContent(text);
        setFileName("Conteúdo colado da área de transferência");
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Falha ao colar",
            description: "Não foi possível ler da área de transferência.",
        });
    }
  }

  const validateXml = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (xmlContent.trim() && xmlContent.includes("<") && xmlContent.includes(">")) {
        toast({
          title: "XML Válido!",
          description: "A estrutura do XML parece estar correta.",
          className: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700",
        });
      } else {
        toast({
          variant: "destructive",
          title: "XML Inválido",
          description: "O conteúdo não parece ser um XML válido. Verifique.",
        });
      }
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <FileCode className="h-6 w-6 text-primary" />
          Validador de XML
        </CardTitle>
        <CardDescription>
          Cole o conteúdo do seu XML ou carregue um arquivo para fazer a validação da estrutura.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="xml-upload" className="w-full">
                <Button asChild variant="outline" className="w-full cursor-pointer">
                    <span><Upload className="mr-2"/>Carregar Arquivo XML</span>
                </Button>
                <Input id="xml-upload" type="file" accept=".xml,text/xml" className="sr-only" onChange={handleFileChange} />
            </label>
            <Button variant="outline" className="w-full" onClick={handlePaste}>
                <ClipboardPaste className="mr-2" />
                Colar Conteúdo
            </Button>
        </div>
        
        {fileName && <p className="text-sm text-muted-foreground text-center">Arquivo carregado: {fileName}</p>}
        
        <Textarea
          placeholder="<nfe>...</nfe>"
          value={xmlContent}
          onChange={(e) => setXmlContent(e.target.value)}
          rows={12}
          className="font-mono text-xs"
        />
        <Button
          onClick={validateXml}
          disabled={isSubmitting || !xmlContent}
          className="w-full bg-gradient-to-r from-accent to-primary text-white"
        >
          {isSubmitting ? "Validando..." : "Validar XML"}
        </Button>
      </CardContent>
    </Card>
  );
}
