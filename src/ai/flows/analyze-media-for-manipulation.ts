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
import {googleAI} from '@genkit-ai/google-genai';
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


const analysisPrompt = ai.definePrompt({
    name: 'mediaManipulationAnalysisPrompt',
    input: { schema: AnalyzeMediaForManipulationInputSchema },
    output: { schema: AnalyzeMediaForManipulationOutputSchema },
    prompt: `You are a world-class digital media forensics expert. Your task is to analyze the provided media file for any signs of digital manipulation, including deepfakes, generative AI content, or other alterations.

    Media to Analyze:
    {{media url=mediaUrl}}

    Your analysis should focus exclusively on the content of the media itself. Look for clues such as:
    - Visual inconsistencies (e.g., unnatural lighting, strange shadows, inconsistent focus, weird blurring around edges).
    - Artifacts from generative models (e.g., waxy skin textures, strange patterns in the background, distorted hands or eyes).
    - Audio anomalies (e.g., robotic-sounding speech, lack of background noise, unnatural intonation or pacing) if audio is present.
    - Compression or quality inconsistencies that might suggest splicing or editing.

    Based on your analysis, provide a list of specific, observable signals of potential manipulation in the 'reasons' field. If you find no signals, return an empty array.
    Also, provide a list of potential variants of the media you can infer from the content in the 'variants' field.
    `,
});

const analyzeMediaForManipulationFlow = ai.defineFlow(
  {
    name: 'analyzeMediaForManipulationFlow',
    inputSchema: AnalyzeMediaForManipulationInputSchema,
    outputSchema: AnalyzeMediaForManipulationOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-2.5-pro'),
      prompt: analysisPrompt.render({ input }),
      output: {
        schema: AnalyzeMediaForManipulationOutputSchema,
      },
    });
    return output!;
  }
);
