'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { TimelineEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProvenanceTimelineProps {
  timeline: TimelineEvent[];
  visibleNodes: number;
}

const ProvenanceTimeline: React.FC<ProvenanceTimelineProps> = ({ timeline, visibleNodes }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-muted-foreground">No provenance data available.</p>;
  }

  const getLabelColor = (label?: TimelineEvent['label']) => {
    switch (label) {
      case 'First known appearance':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rapid re-sharing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Context shift':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return '';
    }
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="relative flex items-start space-x-2 min-w-max h-28">
        {/* Dotted line */}
        <div className="absolute top-4 left-0 w-full h-px bg-border border-t border-dashed"></div>
        
        {timeline.map((event, index) => (
          <React.Fragment key={index}>
            <div className={cn("relative z-10 transition-all duration-500 ease-in-out",
              index < visibleNodes ? 'opacity-100' : 'opacity-0'
            )}>
              <Popover>
                <PopoverTrigger asChild disabled={index >= visibleNodes}>
                  <div className={cn("group flex flex-col items-center cursor-pointer text-center space-y-2 p-2 rounded-lg hover:bg-muted transition-colors w-32", { 'cursor-default': index >= visibleNodes })}>
                    <div className={cn("w-4 h-4 bg-background border-2 rounded-full transition-all duration-300", 
                      index === visibleNodes - 1 ? 'border-accent scale-150' : 'border-primary group-hover:scale-125'
                    )}></div>
                    <Badge variant="secondary" className="text-xs truncate w-full">
                      {event.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleDateString()}</span>
                     {event.label && (
                      <Badge variant="outline" className={`text-xs mt-1 ${getLabelColor(event.label)}`}>{event.label}</Badge>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Context Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.contextSummary}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProvenanceTimeline;
