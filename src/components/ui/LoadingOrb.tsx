import React from 'react';
import { motion } from 'framer-motion';

export const LoadingOrb: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className="relative w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-blue-400/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};
