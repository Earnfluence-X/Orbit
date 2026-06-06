import { useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { speechRecognition } from '@/lib/speechRecognition';
import { speechSynthesis } from '@/lib/speechSynthesis';
import { getVoiceConfig } from '@/data/voiceProfiles';

export function useVoice() {
  const {
    isListening,
    setIsListening,
    isMuted,
    user,
    setIsSpeaking,
    setOrbState,
  } = useStore();

  const startListening = useCallback(() => {
    if (isListening) return;

    speechRecognition.start(
      (result) => {
        if (result.isFinal) {
          // Transcript handling is done in InputBar
        }
      },
      (listening) => {
        setIsListening(listening);
        if (listening) setOrbState('listening');
      }
    );
  }, [isListening, setIsListening, setOrbState]);

  const stopListening = useCallback(() => {
    speechRecognition.stop();
    setIsListening(false);
  }, [setIsListening]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (isMuted) return;
      const config = getVoiceConfig(user?.voicePreference || 'neutral');

      setIsSpeaking(true);
      setOrbState('speaking');
      speechSynthesis.speak(
        text,
        {
          rate: user?.speechSpeed || config.rate,
          pitch: config.pitch,
          voice: config.speechSynthVoice,
        },
        () => {
          setIsSpeaking(false);
          setOrbState('idle');
          onEnd?.();
        }
      );
    },
    [isMuted, user, setIsSpeaking, setOrbState]
  );

  const stopSpeaking = useCallback(() => {
    speechSynthesis.stop();
    setIsSpeaking(false);
  }, [setIsSpeaking]);

  useEffect(() => {
    return () => {
      speechRecognition.stop();
    };
  }, []);

  return {
    isListening,
    isAvailable: speechRecognition.isAvailable(),
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
