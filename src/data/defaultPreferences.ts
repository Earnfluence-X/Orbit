import { UserProfile } from '@/types';

export const defaultPreferences: UserProfile = {
  id: '',
  name: 'Friend',
  voicePreference: 'neutral',
  detailLevel: 'balanced',
  interests: ['technology', 'science', 'design'],
  savedTopics: [],
  preferredSources: [],
  languageStyle: 'mixed',
  autoListen: true,
  wakeWordEnabled: true,
  speechSpeed: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
