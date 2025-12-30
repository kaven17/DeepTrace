'use client';

import { useState } from 'react';
import { runAnalysis } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import Logo from '@/components/logo';
import UploadScreen from '@/components/screens/upload-screen';
import AnalysisScreen from '@/components/screens/analysis-screen';
import ResultsScreen from '@/components/screens/results-screen';
import { useToast } from '@/hooks/use-toast';

type AnalysisState = 'idle' | 'analyzing' | 'complete';

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (formData: FormData) => {
    setAnalysisState('analyzing');
    try {
      const result = await runAnalysis(formData);
      setAnalysisResult(result);
      setAnalysisState('complete');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
      setAnalysisState('idle');
    }
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setAnalysisResult(null);
  };

  const renderContent = () => {
    switch (analysisState) {
      case 'analyzing':
        return <AnalysisScreen />;
      case 'complete':
        return analysisResult ? <ResultsScreen result={analysisResult} onReset={handleReset} /> : null;
      case 'idle':
      default:
        return <UploadScreen onAnalyze={handleAnalysis} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl mx-auto">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full">
        {renderContent()}
      </main>
    </div>
  );
}
