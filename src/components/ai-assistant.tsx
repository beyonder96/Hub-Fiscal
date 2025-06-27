"use client";

import { useState } from "react";
import { askTaxQuestion, type AskTaxQuestionOutput } from "@/ai/flows/tax-question-assistant";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskTaxQuestionOutput | null>(null);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const answer = await askTaxQuestion({ question });
      setResult(answer);
    } catch (error) {
      console.error("Error asking tax question:", error);
      toast({
        variant: "destructive",
        title: "Erro ao consultar IA",
        description: "Não foi possível obter uma resposta. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
            size="icon"
          >
            <Bot className="h-8 w-8" />
            <span className="sr-only">Tirar Dúvidas Fiscais</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-5 w-5 text-accent" />
              Tirar Dúvidas Fiscais
            </DialogTitle>
            <DialogDescription>
              Use nosso assistente de IA para responder suas perguntas sobre
              impostos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Digite sua pergunta sobre impostos aqui..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
            />
            <Button onClick={handleAskQuestion} disabled={loading || !question.trim()}>
              {loading ? "Pensando..." : "Perguntar"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {loading && (
             <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[220px]" />
             </div>
          )}
          {result && (
            <div className="prose prose-sm mt-4 max-h-60 overflow-y-auto rounded-md border bg-secondary/50 p-4">
              <p>{result.answer}</p>
            </div>
          )}
          <DialogFooter>
            <p className="text-xs text-muted-foreground">
              As respostas são geradas por IA e devem ser usadas para referência.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
