'use server';

import { analyzeMediaForManipulation } from '@/ai/flows/analyze-media-for-manipulation';
import { generateProvenanceSummary } from '@/ai/flows/generate-provenance-timeline';
import { assessManipulationRiskLevel } from '@/ai/flows/assess-manipulation-risk-level';
import { z } from 'zod';
import type { AnalysisResult } from '@/lib/types';
import { getMediaFingerprint } from '@/core/fingerprinting/media-fingerprint';
import { runOsintSearch } from '@/core/osint/osint-engine';
import { buildProvenanceTimeline } from '@/core/provenance/build-timeline';

// Helper to convert file to data URI
async function fileToDataUri(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

const urlSchema = z.string().url({ message: "Please enter a valid URL." });

export async function runAnalysis(formData: FormData): Promise<AnalysisResult> {
  const file = formData.get('file') as File | null;
  const url = formData.get('url') as string | null;

  let mediaUrl: string;
  let mediaType: 'image' | 'video' | 'audio' | 'url' = 'url';
  
  if (file && file.size > 0) {
    mediaUrl = await fileToDataUri(file);
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
  } else if (url) {
    const validatedUrl = urlSchema.safeParse(url);
    if (!validatedUrl.success) {
      throw new Error(validatedUrl.error.errors[0].message);
    }
    mediaUrl = validatedUrl.data;
  } else {
    throw new Error('No media provided. Please upload a file or enter a URL.');
  }

  // 1. Core Logic: Fingerprinting (Deterministic)
  const fingerprint = await getMediaFingerprint({ mediaType, mediaUrl });

  // 2. Core Logic: OSINT Search (Deterministic - Mocked)
  const osintHits = await runOsintSearch(fingerprint);

  // 3. Core Logic: Build Timeline (Deterministic)
  const timeline = buildProvenanceTimeline(osintHits);

  // 4. AI Reasoning Layer
  const [manipulationAnalysis, provenanceSummary] = await Promise.all([
    // AI analyzes the media itself for artifacts
    analyzeMediaForManipulation({ mediaUrl, mediaType }),
    // AI summarizes the deterministic timeline
    generateProvenanceSummary({ timeline }),
  ]);

  // 5. Hybrid AI + Rules for final assessment
  const riskAssessment = await assessManipulationRiskLevel({
    aiAnalysisSignals: manipulationAnalysis.reasons,
    provenanceTimeline: timeline,
  });

  const finalResult: AnalysisResult = {
    riskLevel: riskAssessment.riskLevel,
    reasons: riskAssessment.reasons,
    confidence: riskAssessment.confidence,
    summary: provenanceSummary.summary,
    timeline: timeline,
    variants: manipulationAnalysis.variants,
    aiReasons: manipulationAnalysis.reasons,
    mediaUrl,
    mediaType,
  };
  
  // Simulate processing time for a better UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  return finalResult;
}
