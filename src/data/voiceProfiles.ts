import { VoiceProfile } from '@/types';

export interface VoiceProfileConfig {
  id: VoiceProfile;
  label: string;
  description: string;
  speechSynthVoice: string;
  rate: number;
  pitch: number;
}

export const voiceProfiles: VoiceProfileConfig[] = [
  {
    id: 'neutral',
    label: 'Neutral',
    description: 'Clear and balanced voice',
    speechSynthVoice: 'Google US English',
    rate: 1.0,
    pitch: 1.0,
  },
  {
    id: 'male_natural',
    label: 'Natural Male',
    description: 'Warm male voice',
    speechSynthVoice: 'Google US English Male',
    rate: 1.0,
    pitch: 0.95,
  },
  {
    id: 'female_natural',
    label: 'Natural Female',
    description: 'Warm female voice',
    speechSynthVoice: 'Google US English Female',
    rate: 1.0,
    pitch: 1.05,
  },
  {
    id: 'male_deep',
    label: 'Deep Male',
    description: 'Deep, authoritative voice',
    speechSynthVoice: 'Google US English Male',
    rate: 0.9,
    pitch: 0.8,
  },
  {
    id: 'female_warm',
    label: 'Warm Female',
    description: 'Warm and friendly voice',
    speechSynthVoice: 'Google US English Female',
    rate: 0.95,
    pitch: 1.1,
  },
];

export function getVoiceConfig(profile: VoiceProfile): VoiceProfileConfig {
  return voiceProfiles.find((v) => v.id === profile) || voiceProfiles[0];
}
