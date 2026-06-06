import React from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  barCount = 12,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
          animate={{
            height: isActive
              ? [
                  `${8 + Math.sin(i * 0.8) * 4}px`,
                  `${16 + Math.sin(i * 0.8 + 1) * 8}px`,
                  `${8 + Math.sin(i * 0.8) * 4}px`,
                ]
              : '4px',
            opacity: isActive ? [0.4, 1, 0.4] : 0.3,
          }}
          transition={{
            duration: 0.6 + (i % 3) * 0.1,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
