import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { CardGrid } from './CardGrid';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import { LoadingOrb } from '@/components/ui/LoadingOrb';
import { useStore } from '@/lib/store';

interface ConversationFlowProps {
  messages: Message[];
  streamingContent: string;
  onFollowUpSelect?: (suggestion: string) => void;
}

export const ConversationFlow: React.FC<ConversationFlowProps> = ({
  messages,
  streamingContent,
  onFollowUpSelect,
}) => {
  const { isLoading } = useStore();

  if (messages.length === 0 && !streamingContent) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-2">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.cards && message.cards.length > 0 && (
              <motion.div
                className="ml-0 md:ml-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CardGrid cards={message.cards} />
              </motion.div>
            )}
            {message.followUpSuggestions &&
              message.followUpSuggestions.length > 0 &&
              onFollowUpSelect && (
                <motion.div
                  className="ml-0 md:ml-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FollowUpSuggestions
                    suggestions={message.followUpSuggestions}
                    onSelect={onFollowUpSelect}
                  />
                </motion.div>
              )}
          </div>
        ))}
      </AnimatePresence>

      {/* Streaming message */}
      {streamingContent && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-[80%]">
            <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white/[0.03] border border-white/5 text-white/80">
              <p className="whitespace-pre-wrap">
                {streamingContent}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-1 h-4 bg-white/60 ml-0.5 align-middle"
                />
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && !streamingContent && <LoadingOrb />}
    </div>
  );
};
