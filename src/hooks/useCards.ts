import { useCallback } from 'react';
import { useStore } from '@/lib/store';
import { ResponseCard } from '@/types';

export function useCards() {
  const { savedCards, saveCard, removeCard, expandCard } = useStore();

  const isCardSaved = useCallback(
    (cardId: string) => savedCards.some((c) => c.id === cardId),
    [savedCards]
  );

  const toggleSave = useCallback(
    (card: ResponseCard) => {
      if (isCardSaved(card.id)) {
        removeCard(card.id);
      } else {
        saveCard(card);
      }
    },
    [isCardSaved, removeCard, saveCard]
  );

  return {
    savedCards,
    saveCard,
    removeCard,
    expandCard,
    toggleSave,
    isCardSaved,
  };
}
