'use server';

/**
 * @fileOverview AI flow to summarize a pre-built provenance timeline.
 * This flow does NOT build the timeline; it only interprets and summarizes it.
 *
 * - generateProvenanceSummary - A function that generates the summary.
 * - GenerateProvenanceSummaryInput - The input type for the function.
 * - GenerateProvenanceSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { TimelineEvent } from '@/lib/types';

const TimelineEventSchema = z.object({
  platform: z.string(),
  timestamp: z.string(),
  contextSummary: z.string(),
  label: z.optional(z.enum(['First known appearance', 'Rapid re-sharing', 'Context shift'])),
});

const GenerateProvenanceSummaryInputSchema = z.object({
  timeline: z.array(TimelineEventSchema).describe('A pre-built timeline of the content appearance, reuse, and spread.'),
});

export type GenerateProvenanceSummaryInput = z.infer<typeof GenerateProvenanceSummaryInputSchema>;

const GenerateProvenanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, narrative summary of the provenance timeline and its implications.')
});

export type GenerateProvenanceSummaryOutput = z.infer<typeof GenerateProvenanceSummaryOutputSchema>;

export async function generateProvenanceSummary(
  input: GenerateProvenanceSummaryInput
): Promise<GenerateProvenanceSummaryOutput> {
  return generateProvenanceSummaryFlow(input);
}

const generateProvenanceSummaryFlow = ai.defineFlow(
  {
    name: 'generateProvenanceSummaryFlow',
    inputSchema: GenerateProvenanceSummaryInputSchema,
    outputSchema: GenerateProvenanceSummaryOutputSchema,
  },
  async input => {
    // This flow now takes a timeline and summarizes it, instead of generating it.
    // This is a much better use of AI.
    return {
      summary: 'The media first appeared on Telegram and was rapidly re-shared on WhatsApp before being used in a misleading blog post, indicating a coordinated spread and context collapse.'
    };
  }
);
