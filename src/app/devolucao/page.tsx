
import { Header } from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Undo2, Target, BookOpen, ThumbsUp, ThumbsDown, AlertTriangle, ListChecks, ClipboardSignature, Truck, FileText, Banknote, HelpCircle, Phone, Mail } from "lucide-react";

const steps = [
    { title: "Contato do cliente", description: "Cliente informa a necessidade de devolução, com motivo claro e data da compra." },
    { title: "Análise pelo vendedor", description: "Verificar prazo e estado do produto. Se estiver tudo conforme, autorizar devolução." },
    { title: "NF de Devolução", description: "Cliente deverá emitir a nota contendo as mesmas informações da nota original (Produtos, Valores, Quantidade, Impostos, CFOP, CST, Origem, etc.), referenciando a NF de origem. A nota deve ser validada pelo setor fiscal antes da devolução ser formalizada." },
    { title: "Preenchimento do RMA", description: "Vendedor preenche o formulário RMA (Fiscal\\RMA - DEVOLUÇÃO.xlsx) com todos os campos obrigatórios e anexa a NF de Venda e a NF de Devolução do cliente. A assinatura da Logística e da Diretoria é obrigatória." },
];

export default function DevolucaoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <Undo2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Procedimento – Devolução ou Recusa de Mercadoria (RMA)
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Guia para devolução ou recusa de mercadoria, assegurando conformidade fiscal.
            </p>
            <Badge variant="secondary">Versão atualizada: Maio/2025</Badge>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border">
            <CardContent className="p-4 md:p-6">
                 <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold"><Target className="mr-2 h-5 w-5 text-primary"/>1. Objetivo</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none px-2">
                           <p>Estabelecer o processo correto para devolução ou recusa de mercadoria por parte dos clientes, assegurando conformidade fiscal e evitando retrabalhos.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold"><BookOpen className="mr-2 h-5 w-5 text-primary"/>2. Conceitos Importantes</AccordionTrigger>
                        <AccordionContent className="space-y-4 px-2">
                            <div className="flex items-start gap-3">
                                <ThumbsUp className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Devolução</h4>
                                    <p className="text-sm text-muted-foreground">O cliente recebeu a mercadoria, deu entrada no seu estoque e, por algum motivo, irá devolvê-la com emissão de nota fiscal de devolução.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <ThumbsDown className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Recusa</h4>
                                    <p className="text-sm text-muted-foreground">O cliente não recebe a mercadoria e a devolve no momento da entrega. O cliente deve recusar a NF eletronicamente via SEFAZ e formalizar a devolução.</p>
                                </div>
                            </div>
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Atenção</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5">
                                        <li>A Equipa só pode emitir NF de devolução pelo cliente quando este <strong>não der entrada</strong> no produto.</li>
                                        <li>Se o cliente não for contribuinte, deverá enviar uma declaração por escrito com os dados da nota fiscal (número, produtos, valores e motivo).</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold"><ListChecks className="mr-2 h-5 w-5 text-primary"/>3. Situações que Justificam Devolução</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none px-2">
                           <ul className="list-disc pl-5">
                                <li>Produto avariado ou danificado</li>
                                <li>Produto em desacordo com o pedido</li>
                                <li>NF emitida com erro</li>
                                <li>Entrega em local incorreto</li>
                                <li>Cliente desconhece a compra</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg font-semibold"><ClipboardSignature className="mr-2 h-5 w-5 text-primary"/>4. Regras e Procedimento</AccordionTrigger>
                        <AccordionContent className="space-y-6 px-2">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Regras de Aceitação</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li>Prazo máximo: <strong>7 dias</strong> após o recebimento.</li>
                                    <li>Produto deve estar sem uso e devidamente embalado.</li>
                                    <li>No ES (filial Serra): somente será recebida pela LISA com autorização via formulário RMA.</li>
                                    <li className="font-bold text-destructive">Todo RMA precisa de assinatura da Diretoria. Sem isso, a logística não aceitará a devolução.</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground mb-2">Procedimento de Devolução – Passo a Passo</h4>
                                <ol className="relative border-l border-border ml-2">
                                    {steps.map((step, index) => (
                                    <li key={index} className="mb-6 ml-6">
                                        <span className="absolute -left-[9px] flex items-center justify-center w-5 h-5 bg-primary rounded-full text-primary-foreground text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <h5 className="font-semibold">{step.title}</h5>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </li>
                                    ))}
                                </ol>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5">
                        <AccordionTrigger className="text-lg font-semibold"><Truck className="mr-2 h-5 w-5 text-primary"/>5. Recusa e Entrega</AccordionTrigger>
                        <AccordionContent className="space-y-4 px-2">
                             <div>
                                <h4 className="font-semibold text-foreground">Recusa da Mercadoria</h4>
                                <p className="text-sm text-muted-foreground">Quando a recusa ocorre antes da entrega, cliente deve registrar a recusa via SEFAZ e preencher o RMA normalmente. A Equipa só emitirá NF de devolução pelo cliente após formalização da recusa.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Entrega da Documentação</h4>
                                <p className="text-sm text-muted-foreground">Após assinatura e validação, entregar para a Logística o RMA preenchido, NF de Venda e a NF de Devolução do cliente. A Logística fará a conferência e encaminhará ao setor de Recebimento/Faturamento.</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-lg font-semibold"><Banknote className="mr-2 h-5 w-5 text-primary"/>6. Resultado Fiscal e Financeiro</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none px-2">
                           <ul className="list-disc pl-5">
                               <li>Após entrada da NF no sistema, o boleto será cancelado.</li>
                               <li>O crédito será gerado ao cliente automaticamente.</li>
                               <li>Caso haja prejuízo interno, preencher no campo "Recuperação de Valores" no RMA.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-7" className="border-b-0">
                        <AccordionTrigger className="text-lg font-semibold"><HelpCircle className="mr-2 h-5 w-5 text-primary"/>7. Dúvidas e Contato</AccordionTrigger>
                        <AccordionContent className="space-y-3 px-2">
                           <h4 className="font-semibold text-foreground">Departamento Fiscal</h4>
                           <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" /> Ramal: 7542
                           </div>
                           <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" /> E-mail: fiscal@equipa.com.br
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
