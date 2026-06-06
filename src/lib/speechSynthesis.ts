class SpeechSynthesisService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices(): void {
    if (!this.synthesis) return;
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis!.getVoices();
      };
    }
  }

  speak(
    text: string,
    options?: { rate?: number; pitch?: number; voice?: string },
    onEnd?: () => void
  ): void {
    if (!this.synthesis) return;

    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[*_~`#]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;

    if (options?.voice) {
      const voice = this.voices.find((v) =>
        v.name.toLowerCase().includes(options.voice!.toLowerCase())
      );
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    this.synthesis.cancel();
    this.synthesis.speak(utterance);
  }

  stop(): void {
    this.synthesis?.cancel();
    this.isSpeaking = false;
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  isAvailable(): boolean {
    return !!this.synthesis;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const speechSynthesis = new SpeechSynthesisService();
