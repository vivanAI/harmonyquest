'use server';
/**
 * @fileOverview AI flow to summarize cultural articles for quick understanding.
 *
 * - summarizeCulturalArticle - A function that summarizes a given cultural article.
 * - SummarizeCulturalArticleInput - The input type for the summarizeCulturalArticle function.
 * - SummarizeCulturalArticleOutput - The return type for the summarizeCulturalArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCulturalArticleInputSchema = z.object({
  articleText: z
    .string()
    .describe('The text content of the cultural article to be summarized.'),
});
export type SummarizeCulturalArticleInput = z.infer<typeof SummarizeCulturalArticleInputSchema>;

const SummarizeCulturalArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the cultural article.'),
});
export type SummarizeCulturalArticleOutput = z.infer<typeof SummarizeCulturalArticleOutputSchema>;

export async function summarizeCulturalArticle(
  input: SummarizeCulturalArticleInput
): Promise<SummarizeCulturalArticleOutput> {
  return summarizeCulturalArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCulturalArticlePrompt',
  input: {schema: SummarizeCulturalArticleInputSchema},
  output: {schema: SummarizeCulturalArticleOutputSchema},
  prompt: `You are an AI cultural guide. Please summarize the following article, focusing on the key points and main ideas. Provide a concise and informative summary that will help the user quickly understand the article's content. 

Article:
{{{articleText}}}`,
});

const summarizeCulturalArticleFlow = ai.defineFlow(
  {
    name: 'summarizeCulturalArticleFlow',
    inputSchema: SummarizeCulturalArticleInputSchema,
    outputSchema: SummarizeCulturalArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
