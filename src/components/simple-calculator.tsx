
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';

export function SimpleCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === '.' && input.includes('.')) return;
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
    if (!input) return;
    try {
      // Replace comma with dot for evaluation
      const evalInput = input.replace(/,/g, '.').replace(/[^0-9.*/+\-()]/g, '');
      // eslint-disable-next-line no-eval
      const evalResult = eval(evalInput);
      if (evalResult === Infinity || isNaN(evalResult)) {
        setResult('Erro');
      } else {
        setResult(String(evalResult).replace(/\./g, ','));
      }
    } catch (error) {
      setResult('Erro');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (/[0-9]/.test(key)) {
        handleButtonClick(key);
      } else if (['/', '*', '-', '+', '.'].includes(key)) {
        handleButtonClick(key === '.' ? ',' : key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, result]);

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
    <Card className="w-full shadow-none border-none p-4">
      <div className="text-left mb-4">
        <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold leading-none tracking-tight">Calculadora</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5">
            Faça cálculos rápidos sem sair da página.
        </p>
      </div>
      <CardContent className="p-0 pt-4">
        <div className="bg-muted rounded-lg p-4 text-right mb-4 min-h-[90px] flex flex-col justify-end">
          <div className="text-muted-foreground break-all text-base">{input || '0'}</div>
          <div className="text-3xl font-bold break-all">{result}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              onClick={btn.handler}
              variant="outline"
              className={cn('h-12 text-xl font-bold', btn.className)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
