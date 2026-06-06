import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { TheOrb } from './TheOrb';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { VoiceOutput } from '@/components/voice/VoiceOutput';
import { ConversationFlow } from '@/components/conversation/ConversationFlow';
import { InputBar } from '@/components/input/InputBar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
import { ParticleField } from '@/components/ui/ParticleField';
import { Greeting } from './Greeting';
import { ModeSelector } from '@/components/input/ModeSelector';
import { sendToGemini } from '@/lib/gemini';
import { offlineQueue } from '@/lib/offlineQueue';
import { isOnline } from '@/lib/utils';
import { Menu } from 'lucide-react';

export const OrbitShell: React.FC = () => {
  const {
    isFirstTime,
    messages,
    isLoading,
    streamingContent,
    addMessage,
    updateStreamingContent,
    finalizeMessage,
    createConversation,
    currentConversation,
    currentMode,
    buildContext,
    setOrbState,
    resetQuotaIfNewDay,
    privacyMode,
    toggleSidebar,
    isSidebarOpen,
  } = useStore();

  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetQuotaIfNewDay();
    if (!currentConversation) {
      createConversation();
    }
  }, []);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop =
        conversationRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleQuery = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return;

      if (!isOnline()) {
        offlineQueue.addToQueue(query);
        addMessage({
          role: 'system',
          content:
            'You are offline. Your question has been queued and will be answered when connection is restored.',
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

        updateStreamingContent(response.text);

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
          content:
            'I encountered an error processing your request. Please try again. If this persists, check your API key configuration.',
          cards: [],
          followUpSuggestions: ['Try again', 'Check your connection'],
          audioUrl: null,
          isInterrupted: false,
        });
        setOrbState('error');
      }
    },
    [
      isLoading,
      addMessage,
      setOrbState,
      updateStreamingContent,
      buildContext,
      currentMode,
      finalizeMessage,
    ]
  );

  const handleFollowUpSelect = (suggestion: string) => {
    handleQuery(suggestion);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Animated background */}
      <AnimatedGradient />
      <ParticleField />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          {privacyMode !== 'standard' && (
            <div className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              {privacyMode === 'private' ? 'Private' : 'Incognito'}
            </div>
          )}
        </div>
      </div>

      {/* Greeting */}
      {messages.length === 0 && !isFirstTime && <Greeting />}

      {/* Mode selector */}
      {messages.length === 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <ModeSelector />
        </div>
      )}

      {/* Main content area */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Conversation */}
        <div
          ref={conversationRef}
          className="flex-1 overflow-y-auto px-4 py-24 scrollbar-thin"
        >
          <ConversationFlow
            messages={messages}
            streamingContent={streamingContent}
            onFollowUpSelect={handleFollowUpSelect}
          />
        </div>

        {/* The Orb (center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <TheOrb />
        </div>

        {/* Input area */}
        <div className="relative z-30 pb-6">
          <InputBar onSubmit={handleQuery} />
        </div>
      </div>

      {/* Voice output (auto-speaks responses) */}
      <VoiceOutput />

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};
