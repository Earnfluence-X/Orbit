import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';

interface ComparisonCardProps {
  card: ResponseCardType;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ card }) => {
  return (
    <div>
      <h3 className="text-white/90 font-medium mb-3">{card.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {card.content.split(/vs\.?|versus/i).map((col, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <p className="text-xs text-white/40 mb-1">
              {i === 0 ? 'Option A' : 'Option B'}
            </p>
            <p className="text-white/70 text-sm">{col.trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
