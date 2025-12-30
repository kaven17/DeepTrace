import type { AssessManipulationRiskLevelOutput } from '@/ai/flows/assess-manipulation-risk-level';
import type { GenerateProvenanceTimelineOutput } from '@/ai/flows/generate-provenance-timeline';
import type { AnalyzeMediaForManipulationOutput } from '@/ai/flows/analyze-media-for-manipulation';

export type AnalysisResult = {
  riskLevel: AssessManipulationRiskLevelOutput['riskLevel'];
  reasons: AssessManipulationRiskLevelOutput['reasons'];
  summary: GenerateProvenanceTimelineOutput['summary'];
  timeline: GenerateProvenanceTimelineOutput['timeline'];
  variants: AnalyzeMediaForManipulationOutput['variants'];
  aiReasons: AnalyzeMediaForManipulationOutput['reasons'];
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'url';
};

export type TimelineEvent = GenerateProvenanceTimelineOutput['timeline'][0];
