import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  Conversation,
  Message,
  ResponseCard,
  ConversationMode,
  OrbState,
  PrivacyMode,
  OfflineQueueItem,
  SystemStats,
  Notification,
  ConversationContext,
} from '@/types';
import { generateId } from './utils';
import { defaultPreferences } from '@/data/defaultPreferences';

interface OrbitState {
  user: UserProfile | null;
  isFirstTime: boolean;
  setUser: (user: UserProfile) => void;
  updatePreferences: (updates: Partial<UserProfile>) => void;

  orbState: OrbState;
  setOrbState: (state: OrbState) => void;

  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  setIsListening: (listening: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  toggleMute: () => void;

  currentMode: ConversationMode;
  setMode: (mode: ConversationMode) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;

  createConversation: (mode?: ConversationMode) => string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateStreamingContent: (content: string) => void;
  finalizeMessage: (cards: ResponseCard[], suggestions: string[]) => void;
  saveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  switchConversation: (id: string) => void;

  savedCards: ResponseCard[];
  saveCard: (card: ResponseCard) => void;
  removeCard: (cardId: string) => void;
  expandCard: (cardId: string) => void;

  privacyMode: PrivacyMode;
  setPrivacyMode: (mode: PrivacyMode) => void;

  offlineQueue: OfflineQueueItem[];
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  processQueue: () => void;

  stats: SystemStats;
  updateStats: () => void;
  dailyQuota: number;
  queriesToday: number;
  incrementQueries: () => void;
  resetQuotaIfNewDay: () => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  dismissNotification: (id: string) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;

  buildContext: () => ConversationContext;
}

export const useStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      user: null,
      isFirstTime: true,
      setUser: (user) => set({ user, isFirstTime: false }),
      updatePreferences: (updates) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates, updatedAt: new Date().toISOString() }
            : null,
        })),

      orbState: 'idle',
      setOrbState: (orbState) => set({ orbState }),

      isListening: false,
      isSpeaking: false,
      isMuted: false,
      setIsListening: (isListening) => set({ isListening }),
      setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      currentMode: 'quick',
      setMode: (mode) => set({ currentMode: mode }),
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,
      streamingContent: '',

      createConversation: (mode) => {
        const id = generateId();
        const conversationMode = mode || get().currentMode;
        const now = new Date().toISOString();
        const conversation: Conversation = {
          id,
          title: 'New conversation',
          date: now,
          mode: conversationMode,
          messages: [],
          summary: '',
          isSaved: false,
          isArchived: false,
          tags: [],
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversation: conversation,
          messages: [],
          streamingContent: '',
        }));
        return id;
      },

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => {
          const updatedMessages = [...state.messages, newMessage];
          const updatedConversation = state.currentConversation
            ? { ...state.currentConversation, messages: updatedMessages }
            : null;
          if (state.messages.length === 0 && message.role === 'user') {
            const title =
              message.content.substring(0, 50) +
              (message.content.length > 50 ? '...' : '');
            if (updatedConversation) updatedConversation.title = title;
          }
          return {
            messages: updatedMessages,
            currentConversation: updatedConversation,
            conversations: state.conversations.map((c) =>
              c.id === state.currentConversation?.id ? updatedConversation! : c
            ),
          };
        });
        get().incrementQueries();
        get().updateStats();
      },

      updateStreamingContent: (content) => set({ streamingContent: content }),

      finalizeMessage: (cards, suggestions) => {
        set((state) => {
          const streamingMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: state.streamingContent,
            cards,
            followUpSuggestions: suggestions,
            timestamp: new Date().toISOString(),
            audioUrl: null,
            isInterrupted: false,
          };
          const updatedMessages = [...state.messages, streamingMessage];
          return {
            messages: updatedMessages,
            streamingContent: '',
            isLoading: false,
            orbState: 'idle',
            currentConversation: state.currentConversation
              ? { ...state.currentConversation, messages: updatedMessages }
              : null,
          };
        });
      },

      saveConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isSaved: true } : c
          ),
        })),
      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversation:
            state.currentConversation?.id === id ? null : state.currentConversation,
          messages: state.currentConversation?.id === id ? [] : state.messages,
        })),
      archiveConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isArchived: true } : c
          ),
        })),
      switchConversation: (id) => {
        const conversation = get().conversations.find((c) => c.id === id);
        if (conversation) {
          set({
            currentConversation: conversation,
            messages: conversation.messages,
          });
        }
      },

      savedCards: [],
      saveCard: (card) =>
        set((state) => ({
          savedCards: [...state.savedCards, { ...card, isSaved: true }],
        })),
      removeCard: (cardId) =>
        set((state) => ({
          savedCards: state.savedCards.filter((c) => c.id !== cardId),
        })),
      expandCard: (cardId) =>
        set((state) => ({
          messages: state.messages.map((m) => ({
            ...m,
            cards: m.cards.map((c) => ({
              ...c,
              isExpanded: c.id === cardId ? !c.isExpanded : c.isExpanded,
            })),
          })),
        })),

      privacyMode: 'standard',
      setPrivacyMode: (mode) => set({ privacyMode: mode }),

      offlineQueue: [],
      addToQueue: (item) =>
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            {
              ...item,
              id: generateId(),
              timestamp: new Date().toISOString(),
              retryCount: 0,
            },
          ],
        })),
      removeFromQueue: (id) =>
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((q) => q.id !== id),
        })),
      processQueue: async () => {
        const { offlineQueue, removeFromQueue } = get();
        for (const item of offlineQueue) {
          try {
            removeFromQueue(item.id);
          } catch {
            set((state) => ({
              offlineQueue: state.offlineQueue.map((q) =>
                q.id === item.id ? { ...q, retryCount: q.retryCount + 1 } : q
              ),
            }));
          }
        }
      },

      stats: {
        totalConversations: 0,
        totalMessages: 0,
        totalCards: 0,
        savedCards: 0,
        queriesToday: 0,
        quotaRemaining: 50,
        dailyQuota: 50,
      },
      updateStats: () =>
        set((state) => ({
          stats: {
            totalConversations: state.conversations.length,
            totalMessages: state.conversations.reduce(
              (acc, c) => acc + c.messages.length,
              0
            ),
            totalCards:
              state.savedCards.length +
              state.messages.reduce((acc, m) => acc + m.cards.length, 0),
            savedCards: state.savedCards.length,
            queriesToday: state.queriesToday,
            quotaRemaining: state.dailyQuota - state.queriesToday,
            dailyQuota: state.dailyQuota,
          },
        })),
      dailyQuota: 50,
      queriesToday: 0,
      incrementQueries: () =>
        set((state) => ({ queriesToday: state.queriesToday + 1 })),
      resetQuotaIfNewDay: () => {
        const lastReset = localStorage.getItem('orbit-quota-reset');
        const today = new Date().toDateString();
        if (lastReset !== today) {
          localStorage.setItem('orbit-quota-reset', today);
          set({ queriesToday: 0 });
        }
      },

      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateId(),
              timestamp: new Date().toISOString(),
              isRead: false,
            },
            ...state.notifications,
          ].slice(0, 20),
        })),
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      isSidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      isSettingsOpen: false,
      toggleSettings: () =>
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

      buildContext: () => {
        const { user, currentMode, conversations } = get();
        const now = new Date();
        return {
          userName: user?.name || 'Friend',
          preferences: user || defaultPreferences,
          recentConversations: conversations
            .filter((c) => !c.isArchived)
            .slice(0, 5)
            .map((c) => ({
              id: c.id,
              title: c.title,
              date: c.date,
              summary: c.summary,
            })),
          currentMode,
          timeOfDay:
            now.getHours() < 12
              ? 'morning'
              : now.getHours() < 17
                ? 'afternoon'
                : 'evening',
          dateContext: now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          userLocation: null,
        };
      },
    }),
    {
      name: 'orbit-storage',
      partialize: (state) => ({
        user: state.user,
        isFirstTime: state.isFirstTime,
        conversations: state.conversations,
        savedCards: state.savedCards,
        privacyMode: state.privacyMode,
        currentMode: state.currentMode,
        dailyQuota: state.dailyQuota,
        notifications: state.notifications,
      }),
    }
  )
);
