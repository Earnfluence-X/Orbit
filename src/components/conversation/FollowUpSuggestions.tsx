import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-3 mb-4">
      <p className="text-xs text-white/30 mb-2 ml-1">Follow-up questions</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            onClick={() => onSelect(suggestion)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/[0.03] border border-white/5 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/[0.06] transition-all"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight size={12} />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
