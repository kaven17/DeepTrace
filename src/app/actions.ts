'use server';

import { analyzeMediaForManipulation } from '@/ai/flows/analyze-media-for-manipulation';
import { generateProvenanceTimeline } from '@/ai/flows/generate-provenance-timeline';
import { assessManipulationRiskLevel } from '@/ai/flows/assess-manipulation-risk-level';
import { z } from 'zod';
import type { AnalysisResult } from '@/lib/types';

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
  let mediaFingerprint: string;

  if (file && file.size > 0) {
    mediaUrl = await fileToDataUri(file);
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
    // A simplified fingerprint for demonstration purposes
    mediaFingerprint = `file-${file.name}-${file.size}-${file.lastModified}`;
  } else if (url) {
    const validatedUrl = urlSchema.safeParse(url);
    if (!validatedUrl.success) {
      throw new Error(validatedUrl.error.errors[0].message);
    }
    mediaUrl = validatedUrl.data;
    mediaFingerprint = `url-${mediaUrl}`;
  } else {
    throw new Error('No media provided. Please upload a file or enter a URL.');
  }

  // Run analysis in parallel where possible
  const [manipulationAnalysis, provenanceData] = await Promise.all([
    analyzeMediaForManipulation({ mediaUrl }),
    generateProvenanceTimeline({ mediaFingerprint, mediaType }),
  ]);

  // Fuse the results to get a final risk assessment
  const riskAssessment = await assessManipulationRiskLevel({
    aiAnalysisSignals: manipulationAnalysis.reasons.join('\n'),
    provenanceTimeline: provenanceData.summary,
  });

  const finalResult: AnalysisResult = {
    riskLevel: riskAssessment.riskLevel,
    reasons: riskAssessment.reasons,
    summary: provenanceData.summary,
    timeline: provenanceData.timeline,
    variants: manipulationAnalysis.variants,
    aiReasons: manipulationAnalysis.reasons,
    mediaUrl,
    mediaType,
  };

  // Simulate processing time for a better UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  return finalResult;
}
