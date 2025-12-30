import { config } from 'dotenv';
config();

import '@/ai/flows/generate-provenance-timeline.ts';
import '@/ai/flows/analyze-media-for-manipulation.ts';
import '@/ai/flows/assess-manipulation-risk-level.ts';