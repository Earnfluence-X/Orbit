import React from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50',
    secondary:
      'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20',
    ghost: 'text-white/60 hover:text-white/90 hover:bg-white/5',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-full font-medium transition-all overflow-hidden ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
