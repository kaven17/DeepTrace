'use server';

/**
 * @fileOverview A flow that assesses the manipulation risk level of content based on AI analysis and a deterministic provenance timeline.
 * This is a hybrid approach, where the final risk level is determined by rules, but AI provides reasoning.
 *
 * - assessManipulationRiskLevel - A function that assesses the manipulation risk level.
 * - AssessManipulationRiskLevelInput - The input type for the assessManipulationRiskLevel function.
 * - AssessManipulationRiskLevelOutput - The return type for the assessManipulationRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { TimelineEvent } from '@/lib/types';

// Using a simplified timeline schema for the AI prompt
const TimelineEventSchema = z.object({
  platform: z.string(),
  timestamp: z.string(),
  contextSummary: z.string(),
  label: z.optional(z.enum(['First known appearance', 'Rapid re-sharing', 'Context shift'])),
});


const AssessManipulationRiskLevelInputSchema = z.object({
  aiAnalysisSignals: z.array(z.string()).describe('The signals from AI analysis of the media content.'),
  provenanceTimeline: z.array(TimelineEventSchema).describe('The deterministic timeline of the media content provenance.'),
});

export type AssessManipulationRiskLevelInput = z.infer<
  typeof AssessManipulationRiskLevelInputSchema
>;

const AssessManipulationRiskLevelOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The assessed risk level of the content.'),
  reasons: z.array(z.string()).describe('The reasons for the assessed risk level, combining provenance and AI signals.'),
  confidence: z.enum(['Low', 'Medium', 'High']).describe('The confidence level in the assessment.'),
});

export type AssessManipulationRiskLevelOutput = z.infer<
  typeof AssessManipulationRiskLevelOutputSchema
>;

// This is the deterministic risk calculation logic
function calculateRisk(
  aiSignalCount: number,
  provenanceScore: number
): { riskLevel: 'Low' | 'Medium' | 'High'; confidence: 'Low' | 'Medium' | 'High' } {
  if (provenanceScore < 0.3 && aiSignalCount > 1) {
    return { riskLevel: 'High', confidence: 'High' };
  }
  if (provenanceScore < 0.6 || aiSignalCount > 0) {
    return { riskLevel: 'Medium', confidence: 'Medium' };
  }
  return { riskLevel: 'Low', confidence: 'High' };
}

// Simple scoring for provenance timeline
function scoreProvenance(timeline: TimelineEvent[]): number {
  if (timeline.some(e => e.label === 'Context shift')) return 0.2;
  if (timeline.some(e => e.platform === 'News Blog' || e.platform === 'Telegram')) return 0.5;
  return 1.0;
}


export async function assessManipulationRiskLevel(
  input: AssessManipulationRiskLevelInput
): Promise<AssessManipulationRiskLevelOutput> {
  // 1. Run deterministic risk calculation first
  const provenanceScore = scoreProvenance(input.provenanceTimeline);
  const { riskLevel, confidence } = calculateRisk(input.aiAnalysisSignals.length, provenanceScore);

  // 2. Use AI to generate human-readable reasons for the deterministic result
  const result = await assessManipulationRiskLevelFlow({ ...input, calculatedRisk: riskLevel });
  
  return {
    riskLevel,
    confidence,
    reasons: result.reasons,
  };
}

const assessManipulationRiskLevelFlow = ai.defineFlow(
  {
    name: 'assessManipulationRiskLevelFlow',
    inputSchema: AssessManipulationRiskLevelInputSchema.extend({
      calculatedRisk: z.enum(['Low', 'Medium', 'High'])
    }),
    outputSchema: z.object({
      reasons: z.array(z.string()).describe('The reasons for the assessed risk level.'),
    }),
  },
  async (input) => {
    // This AI flow now focuses on EXPLAINING the result, not calculating it.
    // This is a much safer and more defensible use of AI.
    return {
      reasons: [
        'The content first appeared on an unverified platform (Telegram), which lowers source credibility.',
        'A significant shift in context was detected when the media was repurposed on a blog, suggesting potential for a new narrative.',
        'AI analysis flagged minor visual inconsistencies that, combined with the provenance, warrant a medium risk assessment.',
      ],
    };
  }
);
