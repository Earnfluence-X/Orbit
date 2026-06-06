import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  noPadding?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  glow = false,
  noPadding = false,
}) => {
  return (
    <motion.div
      className={`relative rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-2xl ${noPadding ? '' : 'p-6'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        boxShadow: glow
          ? '0 0 30px rgba(100, 150, 255, 0.1), inset 0 0 30px rgba(255, 255, 255, 0.02)'
          : '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(100, 150, 255, 0.08), transparent 60%)',
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
