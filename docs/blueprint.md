# **App Name**: DeepTrace

## Core Features:

- Content Fingerprinting: Generates a unique fingerprint of the uploaded media file for reverse provenance analysis.
- Reverse Provenance Intelligence: Searches for prior public occurrences of the content using OSINT techniques, reconstructing a timeline of appearance, reuse, and spread. The system acts as a tool, potentially adjusting the timeline if information arises during the search, thereby influencing its understanding of source credibility.
- AI-Powered Manipulation Signal Analysis: Uses AI models to identify common deepfake and manipulation signals within the media.
- Manipulation Risk Level Assessment: Fuses the signals from AI analysis and reverse provenance to generate an explainable Manipulation Risk Level (Low/Medium/High).
- Provenance Timeline Visualization: Presents a horizontal timeline view of the content's appearance, reuse, and spread across various platforms.
- Media Reuse/Mutation View: Displays thumbnails of detected variants of the media in different contexts.
- Action Panel: Provides clear next steps, such as verifying via trusted source, not forwarding, and reporting to a cybercrime portal.

## Style Guidelines:

- Primary color: Dark gray / charcoal (#333333) provides a forensic, calm base.
- Accent color: Red/pink tone (#E63946) is used as a strong alert color for risk indication. Avoid bright or saturated colors, maintain the forensic calm aesthetic.
- Headings: 'Space Grotesk' (sans-serif) for a modern, impactful feel.
- Body: 'Inter' (sans-serif) for clean, readable text. Note: currently only Google Fonts are supported.
- Minimal, outline-based icons for a clean and professional look.
- Story-driven layout with a focus on the provenance timeline. Avoid generic dashboard elements and dense tables.
- Subtle, slow, intentional animations to build trust and avoid unnecessary suspense.