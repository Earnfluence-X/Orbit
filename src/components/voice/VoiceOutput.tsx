import React, { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { speechSynthesis } from '@/lib/speechSynthesis';
import { getVoiceConfig } from '@/data/voiceProfiles';

export const VoiceOutput: React.FC = () => {
  const {
    messages,
    isMuted,
    user,
    setIsSpeaking,
    setOrbState,
  } = useStore();

  const speakLastMessage = useCallback(() => {
    if (isMuted) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    const voiceConfig = getVoiceConfig(user?.voicePreference || 'neutral');

    setIsSpeaking(true);
    setOrbState('speaking');

    speechSynthesis.speak(
      lastMessage.content,
      {
        rate: user?.speechSpeed || voiceConfig.rate,
        pitch: voiceConfig.pitch,
        voice: voiceConfig.speechSynthVoice,
      },
      () => {
        setIsSpeaking(false);
        setOrbState('idle');
      }
    );
  }, [messages, isMuted, user, setIsSpeaking, setOrbState]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !lastMessage.isInterrupted) {
        speakLastMessage();
      }
    }
  }, [messages, speakLastMessage]);

  return null;
};
