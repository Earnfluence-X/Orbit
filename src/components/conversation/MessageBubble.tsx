import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types';
import { formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-400/20 text-white/90 ml-auto'
              : 'bg-white/[0.03] border border-white/5 text-white/80'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div
          className={`text-[10px] text-white/20 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
};
