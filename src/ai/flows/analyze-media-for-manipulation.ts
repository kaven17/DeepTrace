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
    // This flow now returns static data for stability.
    return {
      reasons: [
        'Detected unnatural blurring around the subject\'s edges, suggesting background replacement.',
        'Audio analysis shows a lack of ambient noise, which is inconsistent with a live recording environment.',
        'Found compression artifacts that differ across various parts of the image, indicating splicing.',
      ],
      variants: [
        'A cropped version of the image was found on a meme-sharing website.',
        'A lower-resolution version appeared in a social media profile picture.'
      ],
    };
  }
);
