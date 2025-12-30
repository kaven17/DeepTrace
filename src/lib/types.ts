import type { AssessManipulationRiskLevelOutput } from '@/ai/flows/assess-manipulation-risk-level';
import type { GenerateProvenanceSummaryOutput } from '@/ai/flows/generate-provenance-timeline';
import type { AnalyzeMediaForManipulationOutput } from '@/ai/flows/analyze-media-for-manipulation';
import type { OsintHit } from '@/core/osint/osint-engine';

export type TimelineEvent = {
  platform: string;
  timestamp: string;
  contextSummary: string;
  label?: 'First known appearance' | 'Rapid re-sharing' | 'Context shift';
};

export type AnalysisResult = {
  riskLevel: AssessManipulationRiskLevelOutput['riskLevel'];
  reasons: AssessManipulationRiskLevelOutput['reasons'];
  confidence: AssessManipulationRiskLevelOutput['confidence'];
  summary: GenerateProvenanceSummaryOutput['summary'];
  timeline: TimelineEvent[];
  variants: AnalyzeMediaForManipulationOutput['variants'];
  aiReasons: AnalyzeMediaForManipulationOutput['reasons'];
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'url';
};

// Re-exporting for clarity in other parts of the app
export type { OsintHit };
