'use client';

import Image from 'next/image';
import { Check, Copy, Eye, Film, Link, Mic, Repeat } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import RiskBadge from '@/components/risk-badge';
import ProvenanceTimeline from '@/components/provenance-timeline';
import ActionPanel from '@/components/action-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ResultsScreenProps {
  result: AnalysisResult;
  onReset: () => void;
}

const MediaPreview = ({ mediaType, mediaUrl }: { mediaType: AnalysisResult['mediaType']; mediaUrl: string }) => {
  switch (mediaType) {
    case 'image':
      return <Image src={mediaUrl} alt="Analyzed media" width={300} height={200} className="rounded-lg object-cover" />;
    case 'video':
      return <video src={mediaUrl} controls className="rounded-lg w-full max-w-[300px]" />;
    case 'audio':
      return <audio src={mediaUrl} controls className="w-full max-w-[300px]" />;
    case 'url':
      return (
        <div className="flex flex-col items-center gap-2 text-center p-4 border border-dashed rounded-lg">
          <Link className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium">URL Analyzed</p>
          <p className="text-xs text-muted-foreground break-all">{mediaUrl}</p>
        </div>
      );
    default:
      return null;
  }
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onReset }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setIsCopied(true);
    toast({ title: "Results copied to clipboard." });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getIconForReason = (reason: string) => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('facial') || lowerReason.includes('visual')) return <Eye className="w-4 h-4 text-accent" />;
    if (lowerReason.includes('audio')) return <Mic className="w-4 h-4 text-accent" />;
    if (lowerReason.includes('origin') || lowerReason.includes('source') || lowerReason.includes('first seen')) return <Film className="w-4 h-4 text-accent" />;
    return <Repeat className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Risk Verdict</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <RiskBadge riskLevel={result.riskLevel} size="lg" />
              <p className="text-lg font-medium text-muted-foreground">Confidence: High</p>
              <p className="text-base leading-relaxed">
                "{result.summary}"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyzed Media</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <MediaPreview mediaType={result.mediaType} mediaUrl={result.mediaUrl} />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Why This Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Provenance Signals</h3>
              <ul className="space-y-3">
                {result.reasons.map((reason, index) => (
                  <li key={`reason-${index}`} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">{getIconForReason(reason)}</div>
                    <span className="text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold pt-4">AI-flagged Signals</h3>
              <ul className="space-y-3">
                {result.aiReasons.map((reason, index) => (
                  <li key={`ai-reason-${index}`} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">{getIconForReason(reason)}</div>
                    <span className="text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provenance Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ProvenanceTimeline timeline={result.timeline} />
            </CardContent>
          </Card>

          {result.variants && result.variants.length > 0 && (
             <Card>
             <CardHeader>
               <CardTitle>Media Reuse & Variants</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground mb-4">Detected variants of this media used in different contexts.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {PlaceHolderImages.map((variant, index) => (
                    <div key={index} className="space-y-2">
                       <Image
                        src={variant.imageUrl}
                        alt={variant.description}
                        width={200}
                        height={150}
                        className="rounded-md object-cover aspect-[4/3] border-2 border-transparent hover:border-primary transition-colors"
                        data-ai-hint={variant.imageHint}
                      />
                      <p className="text-xs text-muted-foreground">{result.variants[index] || "Variant context"}</p>
                    </div>
                  ))}
                </div>
             </CardContent>
           </Card>
          )}

        </div>
      </div>
       <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={onReset}>
          Analyze Another
        </Button>
        <Button variant="ghost" onClick={handleCopy}>
          {isCopied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
          Copy Results
        </Button>
      </div>

      <ActionPanel />
    </div>
  );
};

export default ResultsScreen;
