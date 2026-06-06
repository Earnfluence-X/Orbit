import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { VoiceWaveform } from '@/components/voice/VoiceWaveform';
import { Mic, MicOff, Send, ArrowUp } from 'lucide-react';

interface InputBarProps {
  onSubmit: (query: string) => void;
}

export const InputBar: React.FC<InputBarProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [interimText, setInterimText] = useState('');
  const { isListening, isLoading, isMuted, toggleMute } = useStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTranscript = useCallback(
    (transcript: string, isFinal: boolean) => {
      if (isFinal) {
        setText((prev) => (prev + ' ' + transcript).trim());
        setInterimText('');
      } else {
        setInterimText(transcript);
      }
    },
    []
  );

  const handleSubmit = () => {
    const query = text.trim();
    if (!query || isLoading) return;
    onSubmit(query);
    setText('');
    setInterimText('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const toggleListening = () => {
    if (isListening) {
      useStore.getState().setIsListening(false);
      useStore.getState().setOrbState('idle');
    } else {
      useStore.getState().setIsListening(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <VoiceInput onTranscript={handleTranscript} />

      <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
        {/* Voice toggle button */}
        <motion.button
          onClick={toggleListening}
          className={`flex-shrink-0 p-2.5 rounded-full transition-all ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/5 text-white/40 hover:text-white/70 border border-transparent'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening ? <Mic size={18} /> : <MicOff size={18} />}
        </motion.button>

        {/* Audio visualization */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <VoiceWaveform isActive={isListening} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? interimText || 'Listening...'
                : 'Ask anything...'
            }
            rows={1}
            className="w-full bg-transparent text-white/90 placeholder-white/30 text-sm resize-none outline-none py-2 px-1 max-h-32"
            disabled={isLoading}
          />
          {interimText && isListening && (
            <span className="absolute left-1 top-2 text-sm text-white/40 pointer-events-none">
              {interimText}
            </span>
          )}
        </div>

        {/* Send button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className={`flex-shrink-0 p-2.5 rounded-full transition-all ${
            text.trim() && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-white/20'
          }`}
          whileHover={text.trim() && !isLoading ? { scale: 1.05 } : {}}
          whileTap={text.trim() && !isLoading ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <ArrowUp size={18} />
            </motion.div>
          ) : (
            <Send size={18} />
          )}
        </motion.button>
      </div>

      {/* Mute toggle */}
      <div className="flex justify-center mt-2">
        <button
          onClick={toggleMute}
          className={`text-[10px] transition-colors ${
            isMuted ? 'text-red-400' : 'text-white/20 hover:text-white/40'
          }`}
        >
          {isMuted ? 'Voice muted' : 'Voice on'}
        </button>
      </div>
    </div>
  );
};
