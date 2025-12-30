'use client';

import Image from 'next/image';
import { Check, Copy, ChevronDown, Eye, Film, Mic, Repeat } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import RiskBadge from '@/components/risk-badge';
import ProvenanceTimeline from '@/components/provenance-timeline';
import ActionPanel from '@/components/action-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
        <div className="flex items-center justify-center p-4 border border-dashed rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground break-all">{mediaUrl}</p>
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
    if (lowerReason.includes('origin') || lowerReason.includes('source') || lowerReason.includes('first known')) return <Film className="w-4 h-4 text-accent" />;
    return <Repeat className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel - The Verdict */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Verdict</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <RiskBadge riskLevel={result.riskLevel} size="lg" />
              <p className="text-lg font-medium text-muted-foreground">
                Confidence Level: <span className="text-primary">{result.confidence}</span>
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

           <Card>
            <CardHeader>
                <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-base leading-relaxed text-muted-foreground italic">
                    "{result.summary}"
                  </p>
            </CardContent>
           </Card>
        </div>

        {/* Right Panel - The Evidence */}
        <div className="lg:col-span-2 space-y-8">

          <Card>
            <CardHeader>
              <CardTitle>Provenance Timeline</CardTitle>
              <p className="text-sm text-muted-foreground pt-1">A timeline of the media's detected appearances online.</p>
            </CardHeader>
            <CardContent>
              <ProvenanceTimeline timeline={result.timeline} />
            </CardContent>
          </Card>

          {result.variants && result.variants.length > 0 && (
             <Card>
             <CardHeader>
               <CardTitle>Media Reuse & Variants</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">Detected variants of this media used in different contexts.</p>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {PlaceHolderImages.slice(0, result.variants.length).map((variant, index) => (
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
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <Card>
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                     <CardTitle>Why This Result?</CardTitle>
                     <p className="text-sm text-muted-foreground pt-1">Expand to see the evidence and signals that led to the verdict.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-0 space-y-4">
                    <h3 className="font-semibold">Provenance Signals</h3>
                    <ul className="space-y-3">
                      {result.reasons.map((reason, index) => (
                        <li key={`reason-${index}`} className="flex items-start gap-3">
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5">{getIconForReason(reason)}</div>
                          <span className="text-muted-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <h3 className="font-semibold pt-4">AI-flagged Content Signals</h3>
                    <ul className="space-y-3">
                      {result.aiReasons.map((reason, index) => (
                        <li key={`ai-reason-${index}`} className="flex items-start gap-3">
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5">{getIconForReason(reason)}</div>
                          <span className="text-muted-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

        </div>
      </div>
       <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={onReset}>
          Analyze Another
        </Button>
        <Button variant="ghost" onClick={handleCopy}>
          {isCopied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
          Copy Full Report
        </Button>
      </div>

      <ActionPanel />
    </div>
  );
};

export default ResultsScreen;
