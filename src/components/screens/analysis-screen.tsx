'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const analysisSteps = [
  'Media Prepared',
  'Deepfake Signals Checked',
  'Source Presence Traced',
  'Timeline Built',
  'Risk Assessed',
];

const AnalysisScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timeouts = analysisSteps.map((_, index) =>
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, index * 750)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-md text-center animate-in fade-in duration-500">
      <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
        Analyzing...
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Our system is running a comprehensive analysis. Please wait.
      </p>
      <div className="mt-12 space-y-4">
        {analysisSteps.map((step, index) => (
          <div key={step} className="flex items-center justify-start p-4 rounded-lg bg-card/50 transition-all duration-300">
            {currentStep > index ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 mr-4" />
            ) : (
              <Loader2 className={cn("w-6 h-6 text-primary mr-4", currentStep === index ? 'animate-spin' : 'opacity-50')} />
            )}
            <span className={cn("text-lg", currentStep > index ? "text-primary" : "text-muted-foreground")}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisScreen;
