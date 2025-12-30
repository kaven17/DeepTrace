'use server';

/**
 * @fileOverview A flow that assesses the manipulation risk level of content based on AI analysis and reverse provenance.
 *
 * - assessManipulationRiskLevel - A function that assesses the manipulation risk level.
 * - AssessManipulationRiskLevelInput - The input type for the assessManipulationRiskLevel function.
 * - AssessManipulationRiskLevelOutput - The return type for the assessManipulationRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessManipulationRiskLevelInputSchema = z.object({
  aiAnalysisSignals: z.string().describe('The signals from AI analysis of the media.'),
  provenanceTimeline: z.string().describe('The timeline of the media content provenance.'),
});

export type AssessManipulationRiskLevelInput = z.infer<
  typeof AssessManipulationRiskLevelInputSchema
>;

const AssessManipulationRiskLevelOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The assessed risk level of the content.'),
  reasons: z.array(z.string()).describe('The reasons for the assessed risk level.'),
});

export type AssessManipulationRiskLevelOutput = z.infer<
  typeof AssessManipulationRiskLevelOutputSchema
>;

export async function assessManipulationRiskLevel(
  input: AssessManipulationRiskLevelInput
): Promise<AssessManipulationRiskLevelOutput> {
  return assessManipulationRiskLevelFlow(input);
}

const assessManipulationRiskLevelPrompt = ai.definePrompt({
  name: 'assessManipulationRiskLevelPrompt',
  input: {schema: AssessManipulationRiskLevelInputSchema},
  output: {schema: AssessManipulationRiskLevelOutputSchema},
  prompt: `You are an expert in assessing the risk of media manipulation and deepfakes.
  Based on the AI analysis signals and the provenance timeline of the content, determine the overall risk level (Low, Medium, or High) that the content has been manipulated.
  Provide a list of concise reasons supporting your risk level assessment. Do not include any introductory or concluding statements.

  AI Analysis Signals:
  {{aiAnalysisSignals}}

  Provenance Timeline:
  {{provenanceTimeline}}`,
});

const assessManipulationRiskLevelFlow = ai.defineFlow(
  {
    name: 'assessManipulationRiskLevelFlow',
    inputSchema: AssessManipulationRiskLevelInputSchema,
    outputSchema: AssessManipulationRiskLevelOutputSchema,
  },
  async input => {
    const {output} = await assessManipulationRiskLevelPrompt(input);
    return output!;
  }
);
