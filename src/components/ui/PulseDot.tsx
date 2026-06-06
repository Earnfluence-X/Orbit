import React from 'react';
import { motion } from 'framer-motion';

interface PulseDotProps {
  color?: string;
  size?: number;
  pulse?: boolean;
}

export const PulseDot: React.FC<PulseDotProps> = ({
  color = '#60a5fa',
  size = 8,
  pulse = true,
}) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 3, height: size * 3 }}>
      {pulse && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 3,
            height: size * 3,
            backgroundColor: color + '22',
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 2}px ${color}66`,
        }}
      />
    </div>
  );
};
