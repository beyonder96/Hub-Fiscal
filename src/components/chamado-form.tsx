
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Chamado, ChamadoFormData } from "@/lib/definitions";
import { chamadoFormSchema, ChamadoTopics } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChamadoForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  const form = useForm<ChamadoFormData>({
    resolver: zodResolver(chamadoFormSchema),
    defaultValues: {
      name: "",
      topic: undefined,
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("file", file);
    } else {
      setFileName("");
      form.setValue("file", undefined);
    }
  };

  const onSubmit = (data: ChamadoFormData) => {
    setIsSubmitting(true);
    
    try {
      const newChamado: Chamado = {
        id: new Date().getTime().toString(),
        name: data.name,
        topic: data.topic,
        description: data.description,
        fileName: fileName,
        status: "Aberto",
        createdAt: new Date().toISOString(),
      };

      const existingChamados: Chamado[] = JSON.parse(localStorage.getItem("chamados") || "[]");
      localStorage.setItem("chamados", JSON.stringify([...existingChamados, newChamado]));

      toast({
        title: "Chamado enviado com sucesso!",
        description: "Você será redirecionado para a lista de chamados.",
      });
      
      form.reset();
      setFileName("");

      setTimeout(() => {
        router.push("/meus-chamados");
        setIsSubmitting(false);
      }, 1500);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar chamado",
        description: "Ocorreu um erro. Por favor, tente novamente.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <FileText className="h-6 w-6 text-primary" />
          Abrir Novo Chamado
        </CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para registrar sua solicitação.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tópico" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ChamadoTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva seu problema ou dúvida em detalhes."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Anexos</FormLabel>
                  <FormControl>
                     <div className="flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <p className="text-muted-foreground truncate pr-4">
                            {fileName || "Nenhum arquivo escolhido"}
                        </p>
                        <label htmlFor="file-upload" className="flex-shrink-0">
                            <Input
                                id="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                            />
                            <span className="whitespace-nowrap inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                Escolher Arquivo
                            </span>
                        </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-accent to-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Chamado"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
