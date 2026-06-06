import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';
import { Lightbulb } from 'lucide-react';

interface CreativeCardProps {
  card: ResponseCardType;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ card }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-yellow-400" />
        <h3 className="text-white/90 font-medium">{card.title}</h3>
      </div>
      <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-xl p-4 border border-yellow-500/10">
        <p className="text-white/70 text-sm leading-relaxed italic">
          {card.content}
        </p>
      </div>
    </div>
  );
};
