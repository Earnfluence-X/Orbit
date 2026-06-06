import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';
import { BarChart3 } from 'lucide-react';

interface AnalysisCardProps {
  card: ResponseCardType;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ card }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className="text-purple-400" />
        <h3 className="text-white/90 font-medium">{card.title}</h3>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
          {card.content}
        </p>
      </div>
      {card.sources.length > 0 && (
        <p className="text-[10px] text-white/20 mt-2">
          {card.sources.length} source{card.sources.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
