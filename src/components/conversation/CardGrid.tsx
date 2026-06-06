import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';
import { ResponseCard } from './ResponseCard';

interface CardGridProps {
  cards: ResponseCardType[];
}

export const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  if (cards.length === 0) return null;

  return (
    <div className="grid gap-3 mt-3">
      {cards.map((card, index) => (
        <ResponseCard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
};
