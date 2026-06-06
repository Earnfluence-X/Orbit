import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ConversationMode } from '@/types';
import { Zap, BookOpen, Brain, GraduationCap, Newspaper } from 'lucide-react';

const modes: {
  id: ConversationMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: 'quick',
    label: 'Quick',
    icon: <Zap size={14} />,
    description: 'Fast, concise answers',
  },
  {
    id: 'deep_dive',
    label: 'Deep Dive',
    icon: <BookOpen size={14} />,
    description: 'Comprehensive analysis',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    icon: <Brain size={14} />,
    description: 'Creative ideation',
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: <GraduationCap size={14} />,
    description: 'Educational content',
  },
  {
    id: 'briefing',
    label: 'Briefing',
    icon: <Newspaper size={14} />,
    description: 'Daily summaries',
  },
];

export const ModeSelector: React.FC = () => {
  const { currentMode, setMode } = useStore();

  return (
    <div className="flex gap-1 p-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl">
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          onClick={() => setMode(mode.id)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            currentMode === mode.id
              ? 'text-white'
              : 'text-white/40 hover:text-white/70'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentMode === mode.id && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/20 border border-blue-400/20"
              layoutId="mode-active"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{mode.icon}</span>
          <span className="relative z-10 hidden sm:inline">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
