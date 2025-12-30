/**
 * @fileOverview Deterministic logic for building a structured timeline from OSINT hits.
 * This involves sorting, deduplicating, and adding narrative labels.
 * This is a NON-AI module.
 */

import type { OsintHit, TimelineEvent } from '@/lib/types';

/**
 * Builds a structured, sorted timeline from a raw list of OSINT hits.
 * @param osintHits The raw search results from the OSINT engine.
 * @returns A sorted array of timeline events with narrative labels.
 */
export function buildProvenanceTimeline(osintHits: OsintHit[]): TimelineEvent[] {
    if (!osintHits || osintHits.length === 0) {
        return [];
    }

    // 1. Sort hits by timestamp, oldest first
    const sortedHits = [...osintHits].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // 2. Add narrative labels based on deterministic rules
    const timeline: TimelineEvent[] = sortedHits.map((hit, index) => {
        const event: TimelineEvent = { ...hit };
        if (index === 0) {
            event.label = 'First known appearance';
        }

        // Rule for 'Context shift'
        if (hit.platform === 'News Blog' && sortedHits.some(h => h.platform === 'Telegram' || h.platform === 'WhatsApp')) {
            event.label = 'Context shift';
        }
        
        // Rule for 'Rapid re-sharing' (e.g., less than 24h between first and second hit)
        if (index === 1) {
            const timeDiff = new Date(hit.timestamp).getTime() - new Date(sortedHits[0].timestamp).getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            if (hoursDiff < 24) {
               // This label might overwrite a previous one, which is fine
               event.label = 'Rapid re-sharing';
            }
        }

        return event;
    });

    return timeline;
}
