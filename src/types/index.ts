export type ConversationMode = 'quick' | 'deep_dive' | 'brainstorm' | 'learning' | 'briefing';
export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'waiting' | 'offline' | 'error';
export type CardCategory = 'knowledge' | 'news' | 'analysis' | 'creative' | 'technical' | 'comparison' | 'steps' | 'code' | 'chart' | 'personal';
export type VoiceProfile = 'male_natural' | 'female_natural' | 'male_deep' | 'female_warm' | 'neutral';
export type DetailLevel = 'brief' | 'balanced' | 'comprehensive';
export type PrivacyMode = 'standard' | 'private' | 'incognito';

export interface UserProfile {
  id: string;
  name: string;
  voicePreference: VoiceProfile;
  detailLevel: DetailLevel;
  interests: string[];
  savedTopics: string[];
  preferredSources: string[];
  languageStyle: 'formal' | 'casual' | 'mixed';
  autoListen: boolean;
  wakeWordEnabled: boolean;
  speechSpeed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  mode: ConversationMode;
  messages: Message[];
  summary: string;
  isSaved: boolean;
  isArchived: boolean;
  tags: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  cards: ResponseCard[];
  followUpSuggestions: string[];
  timestamp: string;
  audioUrl: string | null;
  isInterrupted: boolean;
}

export interface ResponseCard {
  id: string;
  category: CardCategory;
  title: string;
  content: string;
  summary: string;
  media: CardMedia | null;
  sources: CardSource[];
  actions: CardAction[];
  isExpanded: boolean;
  isSaved: boolean;
}

export interface CardMedia {
  type: 'image' | 'chart' | 'code' | 'table' | 'map' | 'video';
  data: unknown;
  caption: string;
}

export interface CardSource {
  title: string;
  url: string;
  publisher: string;
  date: string;
}

export interface CardAction {
  label: string;
  query: string;
  icon: string;
}

export interface ConversationContext {
  userName: string;
  preferences: UserProfile;
  recentConversations: ConversationSummary[];
  currentMode: ConversationMode;
  timeOfDay: string;
  dateContext: string;
  userLocation: string | null;
}

export interface ConversationSummary {
  id: string;
  title: string;
  date: string;
  summary: string;
}

export interface GeminiRequest {
  contents: {
    role: 'user' | 'model';
    parts: { text: string }[];
  }[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig?: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    responseMimeType: string;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
    safetyRatings: unknown[];
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface OfflineQueueItem {
  id: string;
  query: string;
  mode: ConversationMode;
  context: ConversationContext;
  timestamp: string;
  retryCount: number;
}

export interface SystemStats {
  totalConversations: number;
  totalMessages: number;
  totalCards: number;
  savedCards: number;
  queriesToday: number;
  quotaRemaining: number;
  dailyQuota: number;
}

export interface Notification {
  id: string;
  type: 'greeting' | 'suggestion' | 'reminder' | 'update' | 'system';
  title: string;
  message: string;
  action: string | null;
  timestamp: string;
  isRead: boolean;
}
