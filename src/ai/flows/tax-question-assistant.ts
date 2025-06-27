// This is an auto-generated file from Firebase Studio.
'use server';
/**
 * @fileOverview A tax question answering AI assistant.
 * 
 * - askTaxQuestion - A function that handles the tax question process.
 * - AskTaxQuestionInput - The input type for the askTaxQuestion function.
 * - AskTaxQuestionOutput - The return type for the askTaxQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskTaxQuestionInputSchema = z.object({
  question: z.string().describe('The tax question to be answered.'),
});
export type AskTaxQuestionInput = z.infer<typeof AskTaxQuestionInputSchema>;

const AskTaxQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the tax question.'),
});
export type AskTaxQuestionOutput = z.infer<typeof AskTaxQuestionOutputSchema>;

export async function askTaxQuestion(input: AskTaxQuestionInput): Promise<AskTaxQuestionOutput> {
  return askTaxQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askTaxQuestionPrompt',
  input: {schema: AskTaxQuestionInputSchema},
  output: {schema: AskTaxQuestionOutputSchema},
  prompt: `You are a helpful AI assistant specializing in answering tax-related questions based on official documentation.

  Please provide a clear and easy-to-understand answer to the following tax question:

  Question: {{{question}}}`,
});

const askTaxQuestionFlow = ai.defineFlow(
  {
    name: 'askTaxQuestionFlow',
    inputSchema: AskTaxQuestionInputSchema,
    outputSchema: AskTaxQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
