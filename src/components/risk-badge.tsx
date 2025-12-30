import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/lib/types';

interface RiskBadgeProps {
  riskLevel: AnalysisResult['riskLevel'];
  size?: 'sm' | 'lg';
}

const riskConfig = {
  Low: {
    icon: ShieldCheck,
    color: 'text-risk-low',
    bgColor: 'bg-risk-low/10',
    borderColor: 'border-risk-low/20',
  },
  Medium: {
    icon: ShieldAlert,
    color: 'text-risk-medium',
    bgColor: 'bg-risk-medium/10',
    borderColor: 'border-risk-medium/20',
  },
  High: {
    icon: ShieldX,
    color: 'text-risk-high',
    bgColor: 'bg-risk-high/10',
    borderColor: 'border-risk-high/20',
  },
};

const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, size = 'sm' }) => {
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
    <div
      className={cn(
        'inline-flex items-center justify-center gap-2 font-headline font-bold rounded-full border-2',
        config.color,
        config.bgColor,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      <Icon className={cn(iconSizeClasses[size])} />
      <span>{riskLevel} Risk</span>
    </div>
  );
};

export default RiskBadge;
