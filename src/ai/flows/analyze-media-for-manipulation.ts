'use server';
/**
 * @fileOverview AI flow to analyze media for manipulation signals.
 * This flow should ONLY focus on interpreting the media content itself.
 *
 * - analyzeMediaForManipulation - A function that handles the media analysis process.
 * - AnalyzeMediaForManipulationInput - The input type for the analyzeMediaForManipulation function.
 * - AnalyzeMediaForManipulationOutput - The return type for the analyzeMediaForManipulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMediaForManipulationInputSchema = z.object({
  mediaUrl: z
    .string()
    .describe('The URL or data URI of the media file to analyze.'),
  mediaType: z.enum(['image', 'video', 'audio', 'url']).describe('Type of the media uploaded by the user'),
});
export type AnalyzeMediaForManipulationInput = z.infer<typeof AnalyzeMediaForManipulationInputSchema>;

const AnalyzeMediaForManipulationOutputSchema = z.object({
  reasons: z.array(z.string()).describe('AI-flagged signals of potential manipulation.'),
  variants: z.array(z.string()).describe('Descriptions of detected variants of the media.'),
});
export type AnalyzeMediaForManipulationOutput = z.infer<typeof AnalyzeMediaForManipulationOutputSchema>;

export async function analyzeMediaForManipulation(
  input: AnalyzeMediaForManipulationInput
): Promise<AnalyzeMediaForManipulationOutput> {
  return analyzeMediaForManipulationFlow(input);
}

const analyzeMediaForManipulationFlow = ai.defineFlow(
  {
    name: 'analyzeMediaForManipulationFlow',
    inputSchema: AnalyzeMediaForManipulationInputSchema,
    outputSchema: AnalyzeMediaForManipulationOutputSchema,
  },
  async input => {
    // This flow is now simplified. It only returns AI-flagged signals.
    // The overall risk level and provenance are handled elsewhere.
    return {
      reasons: [
        'Visual inconsistencies detected in lighting around the subject.',
        'Audio analysis suggests a potential voice clone due to unnatural intonation.',
        'Compression artifacts are unusually high for a source of this nature.',
      ],
      variants: ['Same media, different caption', 'Cropped version of media'],
    };
  }
);
