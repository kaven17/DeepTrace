import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/lib/types';

interface RiskBadgeProps {
  riskLevel: AnalysisResult['riskLevel'];
  confidence: AnalysisResult['confidence'];
  size?: 'sm' | 'lg';
}

const riskConfig = {
  Low: {
    icon: ShieldCheck,
    color: 'text-risk-low',
    borderColor: 'hsl(var(--risk-low))',
  },
  Medium: {
    icon: ShieldAlert,
    color: 'text-risk-medium',
    borderColor: 'hsl(var(--risk-medium))',
  },
  High: {
    icon: ShieldX,
    color: 'text-risk-high',
    borderColor: 'hsl(var(--risk-high))',
  },
};

const confidencePulse = {
    High: 'animate-pulse-strong',
    Medium: 'animate-pulse-medium',
    Low: ''
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, confidence, size = 'sm' }) => {
  const config = riskConfig[riskLevel] || riskConfig.Medium;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-2xl',
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    lg: 'w-8 h-8',
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'absolute -inset-1 rounded-full opacity-75 blur-md',
          config.color.replace('text-', 'bg-'),
          confidencePulse[confidence]
        )}
        style={{ animationDuration: confidence === 'High' ? '2.5s' : '3.5s' }}
      ></div>
      <div
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-headline font-bold rounded-full border-2 bg-background/80 backdrop-blur-sm',
          config.color,
          sizeClasses[size]
        )}
        style={{ borderColor: config.borderColor }}
      >
        <Icon className={cn(iconSizeClasses[size])} />
        <span>{riskLevel} Risk</span>
      </div>
    </div>
  );
};

export default RiskBadge;
