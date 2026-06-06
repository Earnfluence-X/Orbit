import { useCallback } from 'react';
import { useStore } from '@/lib/store';
import { ConversationMode } from '@/types';

export function useConversation() {
  const {
    conversations,
    currentConversation,
    messages,
    currentMode,
    setMode,
    createConversation,
    switchConversation,
    deleteConversation,
    saveConversation,
    archiveConversation,
  } = useStore();

  const newConversation = useCallback(
    (mode?: ConversationMode) => {
      return createConversation(mode);
    },
    [createConversation]
  );

  return {
    conversations,
    currentConversation,
    messages,
    currentMode,
    setMode,
    newConversation,
    switchConversation,
    deleteConversation,
    saveConversation,
    archiveConversation,
  };
}
