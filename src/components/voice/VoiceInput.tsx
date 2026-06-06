import React, { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { speechRecognition } from '@/lib/speechRecognition';

interface VoiceInputProps {
  onTranscript: (text: string, isFinal: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const { isListening, setIsListening, setOrbState, isSpeaking } = useStore();
  const finalTranscriptRef = useRef('');

  const handleResult = useCallback(
    (result: { transcript: string; isFinal: boolean }) => {
      if (result.isFinal) {
        finalTranscriptRef.current += ' ' + result.transcript;
      }
      onTranscript(result.transcript, result.isFinal);
    },
    [onTranscript]
  );

  const handleStateChange = useCallback(
    (listening: boolean) => {
      setIsListening(listening);
      if (listening) {
        setOrbState('listening');
      }
    },
    [setIsListening, setOrbState]
  );

  useEffect(() => {
    if (isListening && !isSpeaking) {
      finalTranscriptRef.current = '';
      speechRecognition.start(handleResult, handleStateChange);
    } else {
      speechRecognition.stop();
    }

    return () => {
      speechRecognition.stop();
    };
  }, [isListening, isSpeaking, handleResult, handleStateChange]);

  return null; // This is a headless component
};

export const getFinalTranscript = (ref: React.MutableRefObject<string>): string => {
  return ref.current.trim();
};
