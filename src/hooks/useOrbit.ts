import { useCallback } from 'react';
import { useStore } from '@/lib/store';
import { sendToGemini } from '@/lib/gemini';
import { isOnline } from '@/lib/utils';
import { offlineQueue } from '@/lib/offlineQueue';

export function useOrbit() {
  const {
    isLoading,
    currentMode,
    addMessage,
    updateStreamingContent,
    finalizeMessage,
    buildContext,
    setOrbState,
    messages,
  } = useStore();

  const submitQuery = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return;

      if (!isOnline()) {
        offlineQueue.addToQueue(query);
        addMessage({
          role: 'system',
          content: 'Offline. Your question has been queued.',
          cards: [],
          followUpSuggestions: [],
          audioUrl: null,
          isInterrupted: false,
        });
        return;
      }

      addMessage({
        role: 'user',
        content: query,
        cards: [],
        followUpSuggestions: [],
        audioUrl: null,
        isInterrupted: false,
      });

      setOrbState('thinking');
      updateStreamingContent('');

      try {
        const context = buildContext();
        const conversationMessages = useStore.getState().messages;

        const response = await sendToGemini(
          query,
          context,
          conversationMessages.slice(0, -1),
          currentMode
        );

        const words = response.text.split(' ');
        let revealed = '';

        for (let i = 0; i < words.length; i++) {
          revealed += (i > 0 ? ' ' : '') + words[i];
          updateStreamingContent(revealed);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        finalizeMessage(response.cards, response.suggestions);
        setOrbState('idle');
      } catch (error) {
        console.error('Query failed:', error);
        updateStreamingContent('');
        addMessage({
          role: 'assistant',
          content: 'Error processing your request. Please try again.',
          cards: [],
          followUpSuggestions: [],
          audioUrl: null,
          isInterrupted: false,
        });
        setOrbState('error');
      }
    },
    [
      isLoading,
      currentMode,
      addMessage,
      updateStreamingContent,
      finalizeMessage,
      buildContext,
      setOrbState,
    ]
  );

  return {
    submitQuery,
    isLoading,
    messages,
  };
}
