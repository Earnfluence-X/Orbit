import React from 'react';
import { useStore } from '@/lib/store';
import { Bookmark, Trash2 } from 'lucide-react';

export const SavedCards: React.FC = () => {
  const { savedCards, removeCard } = useStore();

  if (savedCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/20 p-6">
        <Bookmark size={32} />
        <p className="mt-2 text-sm">No saved cards</p>
        <p className="text-xs mt-1">Bookmark cards to access them here</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {savedCards.map((card) => (
        <div
          key={card.id}
          className="group px-4 py-3 border-b border-white/[0.02] hover:bg-white/[0.02]"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm text-white/70">{card.title}</h3>
              <p className="text-xs text-white/30 mt-1 line-clamp-2">
                {card.summary}
              </p>
              <span className="text-[10px] text-white/20 mt-1 capitalize">
                {card.category}
              </span>
            </div>
            <button
              onClick={() => removeCard(card.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
