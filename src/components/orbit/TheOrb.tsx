import React, { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useStore } from '@/lib/store';

export const TheOrb: React.FC = () => {
  const { orbState, isListening, isLoading, isSpeaking } = useStore();
  const controls = useAnimation();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    if (isListening) {
      controls.start({
        scale: [1, 1.08, 1],
        borderColor: [
          'rgba(100, 180, 255, 0.6)',
          'rgba(100, 180, 255, 1)',
          'rgba(100, 180, 255, 0.6)',
        ],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      });
    } else if (isLoading || isSpeaking) {
      controls.start({
        scale: [1, 1.05, 1],
        borderColor: [
          'rgba(180, 100, 255, 0.6)',
          'rgba(180, 100, 255, 1)',
          'rgba(180, 100, 255, 0.6)',
        ],
        transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
      });
    } else {
      controls.start({
        scale: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        transition: { duration: 0.5 },
      });
    }
  }, [isListening, isLoading, isSpeaking, controls]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          background:
            'radial-gradient(circle, rgba(100, 150, 255, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: isListening ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: isListening ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: '120px',
          height: '120px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={controls}
      />

      {/* Core orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: '80px',
          height: '80px',
          background:
            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), rgba(100,150,255,0.2) 40%, rgba(50,50,100,0.4) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow:
            '0 0 40px rgba(100, 150, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.6), rgba(100,200,255,0.3) 50%, transparent 100%)',
          }}
          animate={{
            scale: isListening ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isListening ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* State indicator dots */}
        <div className="absolute inset-0">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateY(-30px)`,
              }}
              animate={{
                opacity: isListening ? [0.2, 0.8, 0.2] : [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* State label */}
      <div className="absolute -bottom-8 text-center">
        <span className="text-xs text-white/30 tracking-widest uppercase">
          {orbState === 'idle' && 'Ready'}
          {orbState === 'listening' && 'Listening...'}
          {orbState === 'thinking' && 'Thinking...'}
          {orbState === 'speaking' && 'Speaking...'}
          {orbState === 'waiting' && 'Waiting...'}
          {orbState === 'offline' && 'Offline'}
          {orbState === 'error' && 'Error'}
        </span>
      </div>
    </div>
  );
};
