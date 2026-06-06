import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
        }}
        animate={{
          x: ['0%', '20%', '-10%', '0%'],
          y: ['0%', '-10%', '15%', '0%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
        }}
        animate={{
          x: ['0%', '-15%', '20%', '0%'],
          y: ['0%', '20%', '-10%', '0%'],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
        }}
        animate={{
          x: ['0%', '30%', '-20%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};
