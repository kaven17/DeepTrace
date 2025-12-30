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

const generateProvenanceTimelineFlow = ai.defineFlow(
  {
    name: 'generateProvenanceTimelineFlow',
    inputSchema: GenerateProvenanceTimelineInputSchema,
    outputSchema: GenerateProvenanceTimelineOutputSchema,
  },
  async input => {
    // Return static data instead of calling the AI model.
    return {
      timeline: [
        { platform: 'Telegram', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), contextSummary: 'Shared in a public channel with a sensationalist headline.' },
        { platform: 'WhatsApp', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), contextSummary: 'Forwarded multiple times in various groups without source attribution.' },
        { platform: 'News Blog', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), contextSummary: 'Embedded in a blog post with a misleading narrative.' },
      ],
      riskAssessment: 'Medium',
      summary: 'The media first appeared on a social platform and was later used in a misleading blog post, indicating a medium risk of manipulation for disinformation purposes.'
    };
  }
);
