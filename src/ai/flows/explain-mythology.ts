// src/ai/flows/explain-mythology.ts
'use server';
/**
 * @fileOverview Explains a mythological story or concept in a modern context.
 *
 * - explainMythology - A function that handles the explanation of mythology in a modern context.
 * - ExplainMythologyInput - The input type for the explainMythology function.
 * - ExplainMythologyOutput - The return type for the explainMythology function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMythologyInputSchema = z.object({
  mythologyConcept: z
    .string()
    .describe('The mythological story or concept to be explained.'),
});
export type ExplainMythologyInput = z.infer<typeof ExplainMythologyInputSchema>;

const ExplainMythologyOutputSchema = z.object({
  modernExplanation: z
    .string()
    .describe(
      'An explanation of the mythological story or concept in a modern context, highlighting its relevance to contemporary life.'
    ),
});
export type ExplainMythologyOutput = z.infer<typeof ExplainMythologyOutputSchema>;

export async function explainMythology(input: ExplainMythologyInput): Promise<ExplainMythologyOutput> {
  return explainMythologyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMythologyPrompt',
  input: {schema: ExplainMythologyInputSchema},
  output: {schema: ExplainMythologyOutputSchema},
  prompt: `You are an expert in Indian mythology and spirituality. Your task is to explain the given mythological story or concept in a modern context, making it relevant and understandable for contemporary individuals.

Mythological Concept: {{{mythologyConcept}}}

Provide a clear and insightful explanation that highlights the concept's enduring wisdom and practical applications in modern life.`,
});

const explainMythologyFlow = ai.defineFlow(
  {
    name: 'explainMythologyFlow',
    inputSchema: ExplainMythologyInputSchema,
    outputSchema: ExplainMythologyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
