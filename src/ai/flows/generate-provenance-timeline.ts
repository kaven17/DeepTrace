'use server';

/**
 * @fileOverview Generates a provenance timeline for a given media item.
 *
 * - generateProvenanceTimeline - A function that generates the timeline.
 * - GenerateProvenanceTimelineInput - The input type for the generateProvenanceTimeline function.
 * - GenerateProvenanceTimelineOutput - The return type for the generateProvenanceTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProvenanceTimelineInputSchema = z.object({
  mediaFingerprint: z
    .string()
    .describe('The unique fingerprint of the media file.'),
  mediaType: z.enum(['image', 'video', 'audio', 'url']).describe('Type of the media uploaded by the user'),
});

export type GenerateProvenanceTimelineInput = z.infer<typeof GenerateProvenanceTimelineInputSchema>;

const TimelineEventSchema = z.object({
  platform: z.string().describe('The platform where the content was found (e.g., Telegram, WhatsApp).'),
  timestamp: z.string().describe('The timestamp of the content appearance.'),
  contextSummary: z.string().describe('A brief summary of the context in which the content was used.'),
});

const GenerateProvenanceTimelineOutputSchema = z.object({
  timeline: z.array(TimelineEventSchema).describe('A timeline of the content appearance, reuse, and spread.'),
  riskAssessment: z.enum(['Low', 'Medium', 'High']).describe('Overall risk assessment based on the timeline.'),
  summary: z.string().describe('A summary of the provenance timeline and risk assessment')
});

export type GenerateProvenanceTimelineOutput = z.infer<typeof GenerateProvenanceTimelineOutputSchema>;

export async function generateProvenanceTimeline(
  input: GenerateProvenanceTimelineInput
): Promise<GenerateProvenanceTimelineOutput> {
  return generateProvenanceTimelineFlow(input);
}

const generateProvenanceTimelinePrompt = ai.definePrompt({
  name: 'generateProvenanceTimelinePrompt',
  input: {schema: GenerateProvenanceTimelineInputSchema},
  output: {schema: GenerateProvenanceTimelineOutputSchema},
  prompt: `You are an expert in analyzing the provenance of online content. Given the media fingerprint and media type, your goal is to reconstruct the timeline of the content's appearance, reuse, and spread across the internet. Analyze public sources to identify when and where the content first appeared, how it has been reused in different contexts, and the speed at which it spread.

Media Fingerprint: {{{mediaFingerprint}}}
Media Type: {{{mediaType}}}

Based on your analysis, generate a risk assessment (Low, Medium, or High) indicating the likelihood that the content has been manipulated or is being used for malicious purposes. Provide a clear explanation for your assessment. The risk assessment should be`,
});

const generateProvenanceTimelineFlow = ai.defineFlow(
  {
    name: 'generateProvenanceTimelineFlow',
    inputSchema: GenerateProvenanceTimelineInputSchema,
    outputSchema: GenerateProvenanceTimelineOutputSchema,
  },
  async input => {
    const {output} = await generateProvenanceTimelinePrompt(input);
    return output!;
  }
);
