import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';

export function useWakeWord(onDetected: () => void) {
  const { user } = useStore();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const enabled = user?.wakeWordEnabled ?? true;

  const handleResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const transcript =
        event.results[event.results.length - 1]?.[0]?.transcript
          ?.toLowerCase() || '';
      if (
        transcript.includes('hey orbit') ||
        transcript.includes('hey orb it') ||
        transcript.includes('a orbit')
      ) {
        onDetected();
      }
    },
    [onDetected]
  );

  useEffect(() => {
    if (!enabled) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = handleResult as unknown as (event: Event) => void;

    try {
      recognition.start();
    } catch {
      // Already running
    }

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [enabled, handleResult]);

  return { enabled };
}
