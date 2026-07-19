'use server';

/**
 * @fileOverview AI flow for providing mental health support and encouragement.
 *
 * - mentalHealthCompanion - A function that provides supportive messages.
 * - MentalHealthCompanionInput - The input type for the mentalHealthCompanion function.
 * - MentalHealthCompanionOutput - The return type for the mentalHealthCompanion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalHealthCompanionInputSchema = z.object({
  message: z.string().describe('The user message to the AI Wellness Guide.'),
});
export type MentalHealthCompanionInput = z.infer<typeof MentalHealthCompanionInputSchema>;

const MentalHealthCompanionOutputSchema = z.object({
  response: z.string().describe('The AI Wellness Guide response message.'),
});
export type MentalHealthCompanionOutput = z.infer<typeof MentalHealthCompanionOutputSchema>;

export async function mentalHealthCompanion(input: MentalHealthCompanionInput): Promise<MentalHealthCompanionOutput> {
  return mentalHealthCompanionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthCompanionPrompt',
  input: {schema: MentalHealthCompanionInputSchema},
  output: {schema: MentalHealthCompanionOutputSchema},
  prompt: `You are a calm and wise AI Wellness Guide providing mental health support and encouragement.
  Respond to the user's message with supportive and encouraging words, acting as a mental health companion.

  User message: {{{message}}}
  `,
});

const mentalHealthCompanionFlow = ai.defineFlow(
  {
    name: 'mentalHealthCompanionFlow',
    inputSchema: MentalHealthCompanionInputSchema,
    outputSchema: MentalHealthCompanionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
