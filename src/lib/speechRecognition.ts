import { SpeechRecognitionResult } from '@/types';

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private onResult: ((result: SpeechRecognitionResult) => void) | null = null;
  private onStateChange: ((listening: boolean) => void) | null = null;
  private autoRestart: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        this.isSupported = true;
      }
    }
  }

  private initRecognition(): void {
    if (!this.isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    this.recognition = new SR();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult && this.onResult) {
        this.onResult({
          transcript: lastResult[0].transcript,
          confidence: lastResult[0].confidence,
          isFinal: lastResult.isFinal,
        });
      }
    };

    this.recognition.onstart = () => {
      this.onStateChange?.(true);
    };

    this.recognition.onend = () => {
      this.onStateChange?.(false);
      if (this.autoRestart) {
        setTimeout(() => {
          try {
            this.recognition?.start();
          } catch {
            // Already started or error, ignore
          }
        }, 300);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.onStateChange?.(false);
    };
  }

  start(
    onResult: (result: SpeechRecognitionResult) => void,
    onStateChange: (listening: boolean) => void
  ): void {
    if (!this.isSupported) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.onResult = onResult;
    this.onStateChange = onStateChange;
    this.autoRestart = true;

    if (!this.recognition) {
      this.initRecognition();
    }

    try {
      this.recognition?.start();
    } catch {
      console.error('Failed to start recognition');
    }
  }

  stop(): void {
    this.autoRestart = false;
    this.recognition?.stop();
  }

  isAvailable(): boolean {
    return this.isSupported;
  }
}

export const speechRecognition = new SpeechRecognitionService();
