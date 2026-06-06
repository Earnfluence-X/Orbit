import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { getGreeting } from '@/data/greetingTemplates';
import { getTimeOfDay } from '@/lib/utils';

export const Greeting: React.FC = () => {
  const { user, conversations } = useStore();
  const timeOfDay = getTimeOfDay();
  const isReturning = conversations.length > 0;
  const name = user?.name || 'Friend';
  const greeting = getGreeting(name, timeOfDay, isReturning);

  return (
    <motion.div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-full text-center z-10 pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <motion.h1
        className="text-2xl md:text-3xl font-light text-white/80 tracking-wide"
        initial={{ letterSpacing: '0.5em', opacity: 0 }}
        animate={{ letterSpacing: '0.05em', opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        {greeting}
      </motion.h1>
      <motion.p
        className="mt-2 text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Speak or type to begin
      </motion.p>
    </motion.div>
  );
};
