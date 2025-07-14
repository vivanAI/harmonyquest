'use server';
/**
 * @fileOverview AI cultural guide answering cultural, racial, and religious etiquette questions.
 *
 * - culturalEtiquetteQuery - A function that handles the cultural etiquette query process.
 * - CulturalEtiquetteInput - The input type for the culturalEtiquetteQuery function.
 * - CulturalEtiquetteOutput - The return type for the culturalEtiquetteQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CulturalEtiquetteInputSchema = z.object({
  query: z.string().describe('The cultural, racial, or religious etiquette question.'),
});
export type CulturalEtiquetteInput = z.infer<typeof CulturalEtiquetteInputSchema>;

const CulturalEtiquetteOutputSchema = z.object({
  answer: z.string().describe('The answer to the cultural etiquette question.'),
});
export type CulturalEtiquetteOutput = z.infer<typeof CulturalEtiquetteOutputSchema>;

export async function culturalEtiquetteQuery(input: CulturalEtiquetteInput): Promise<CulturalEtiquetteOutput> {
  return culturalEtiquetteQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'culturalEtiquettePrompt',
  input: {schema: CulturalEtiquetteInputSchema},
  output: {schema: CulturalEtiquetteOutputSchema},
  prompt: `You are a friendly, non-judgmental, and educational AI cultural guide.

  Answer the following question about cultural, racial, or religious etiquette:

  {{query}}

  Use current, reputable sources to build your reply.
  `,
});

const culturalEtiquetteQueryFlow = ai.defineFlow(
  {
    name: 'culturalEtiquetteQueryFlow',
    inputSchema: CulturalEtiquetteInputSchema,
    outputSchema: CulturalEtiquetteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
