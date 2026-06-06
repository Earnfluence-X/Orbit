import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';

interface KnowledgeCardProps {
  card: ResponseCardType;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ card }) => {
  return (
    <div>
      <h3 className="text-white/90 font-medium">{card.title}</h3>
      <p className="text-white/60 text-sm mt-2">{card.content}</p>
    </div>
  );
};
