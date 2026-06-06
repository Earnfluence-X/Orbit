import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';

interface StepsCardProps {
  card: ResponseCardType;
}

export const StepsCard: React.FC<StepsCardProps> = ({ card }) => {
  const steps = card.content.split(/\d+\.\s+/).filter(Boolean);

  return (
    <div>
      <h3 className="text-white/90 font-medium mb-3">{card.title}</h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-medium">
              {i + 1}
            </div>
            <p className="text-white/60 text-sm pt-0.5">{step.trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
