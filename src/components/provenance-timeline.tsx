'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { TimelineEvent } from '@/lib/types';
import { ArrowRight, Info } from 'lucide-react';

interface ProvenanceTimelineProps {
  timeline: TimelineEvent[];
}

const ProvenanceTimeline: React.FC<ProvenanceTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-muted-foreground">No provenance data available.</p>;
  }

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex items-center space-x-2 min-w-max">
        {timeline.map((event, index) => (
          <React.Fragment key={index}>
            <Popover>
              <PopoverTrigger asChild>
                <div className="group flex flex-col items-center cursor-pointer text-center space-y-2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <Badge variant="secondary" className="text-xs">
                    {event.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
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
            {index < timeline.length - 1 && (
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProvenanceTimeline;
