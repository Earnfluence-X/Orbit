import React from 'react';
import { motion } from 'framer-motion';

interface HolographicBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicBorder: React.FC<HolographicBorderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-50"
        style={{
          background:
            'linear-gradient(135deg, rgba(96, 165, 250, 0.4), rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4), rgba(96, 165, 250, 0.4))',
          backgroundSize: '300% 300%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative rounded-2xl bg-[#0a0a1a]">{children}</div>
    </div>
  );
};
