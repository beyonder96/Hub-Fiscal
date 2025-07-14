
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';
import { DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export function SimpleCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (result) {
      setInput(result + value);
      setResult('');
    } else {
      setInput(prev => prev + value);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleEquals = () => {
    try {
      // Replace comma with dot for evaluation
      const evalInput = input.replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const evalResult = eval(evalInput);
      setResult(String(evalResult).replace(/\./g, ','));
    } catch (error) {
      setResult('Erro');
    }
  };

  const buttons = [
    { label: 'C', handler: handleClear, className: 'col-span-2 bg-red-500/10 text-red-500 hover:bg-red-500/20' },
    { label: '⌫', handler: handleBackspace, className: 'bg-secondary' },
    { label: '/', handler: () => handleButtonClick('/'), className: 'bg-primary/10 text-primary' },
    { label: '7', handler: () => handleButtonClick('7') },
    { label: '8', handler: () => handleButtonClick('8') },
    { label: '9', handler: () => handleButtonClick('9') },
    { label: '*', handler: () => handleButtonClick('*'), className: 'bg-primary/10 text-primary' },
    { label: '4', handler: () => handleButtonClick('4') },
    { label: '5', handler: () => handleButtonClick('5') },
    { label: '6', handler: () => handleButtonClick('6') },
    { label: '-', handler: () => handleButtonClick('-'), className: 'bg-primary/10 text-primary' },
    { label: '1', handler: () => handleButtonClick('1') },
    { label: '2', handler: () => handleButtonClick('2') },
    { label: '3', handler: () => handleButtonClick('3') },
    { label: '+', handler: () => handleButtonClick('+'), className: 'bg-primary/10 text-primary' },
    { label: '0', handler: () => handleButtonClick('0'), className: 'col-span-2' },
    { label: ',', handler: () => handleButtonClick(',') },
    { label: '=', handler: handleEquals, className: 'bg-primary text-primary-foreground' },
  ];

  return (
    <Card className="w-full max-w-sm shadow-2xl border-primary/20">
      <DialogHeader>
        <DialogTitle className="sr-only">Calculadora</DialogTitle>
        <DialogDescription className="sr-only">Uma calculadora simples para fazer cálculos rápidos.</DialogDescription>
      </DialogHeader>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Calculator className="h-6 w-6 text-primary" />
          Calculadora
        </CardTitle>
         <CardDescription>
            Faça cálculos rápidos sem sair da página.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-muted rounded-lg p-4 text-right mb-4 min-h-[100px] flex flex-col justify-end">
          <div className="text-muted-foreground break-all text-lg">{input || '0'}</div>
          <div className="text-4xl font-bold break-all">{result}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              onClick={btn.handler}
              variant="outline"
              className={cn('h-16 text-2xl font-bold', btn.className)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
