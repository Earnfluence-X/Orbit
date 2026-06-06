# ORBIT - Futuristic AI Conversational Interface

ORBIT is a voice-first, futuristic AI assistant powered by Google Gemini. It features a stunning holographic interface, natural voice conversations, structured response cards, and deep personalization.

## Features

### Voice-First Interface
- Speak naturally. ORBIT listens and responds with voice.
- Real-time speech recognition via Web Speech API
- Natural text-to-speech responses
- Interruptible - stop ORBIT mid-response
- Voice waveform visualization
- Multiple voice profiles (Neutral, Male, Female, Deep, Warm)

### Beautiful Response Cards
- AI responses rendered as elegant, animated cards
- Card categories: Knowledge, News, Analysis, Creative, Technical, Comparison, Steps, Code
- Expand, collapse, save, and share cards
- Sources and references included
- Smooth spring animations via Framer Motion

### Conversation Modes
- **Quick Mode:** Fast, concise answers
- **Deep Dive Mode:** Comprehensive analysis with deep context
- **Brainstorm Mode:** Creative ideation and lateral thinking
- **Learning Mode:** Structured educational content
- **Briefing Mode:** Summarized overviews

### Personalization
- Remembers your name, preferences, and interests
- Adapts response style over time
- Conversation history with search
- Saved cards for quick reference
- Detail level: Brief, Balanced, Comprehensive

### Privacy
- All data stored locally (localStorage)
- Standard, Private, and Incognito modes
- One-click data deletion
- Export conversation history as JSON

### Offline Support
- Offline queue - questions saved when offline
- Automatic sync when connection is restored
- Online/offline status detection

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| Google Gemini API | AI responses |
| Web Speech API | Voice input/output |
| Lucide React | Icons |
| UUID | ID generation |

## Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/yourusername/orbit.git
cd orbit
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push your repository to GitHub
2. Import the project in Vercel
3. Add the environment variable `VITE_GEMINI_API_KEY` in Vercel project settings
4. Deploy

## Usage

1. **Setup:** On first launch, complete the 30-second setup wizard (name, voice, detail level)
2. **Start a conversation:** Click the orb or start speaking - ORBIT auto-listens
3. **Ask anything:** Speak naturally or type your question
4. **Response cards:** AI responses appear as structured cards with follow-up suggestions
5. **Save & share:** Bookmark cards for later reference
6. **Switch modes:** Use the mode selector for different conversation styles
7. **Voice control:** Toggle voice input/output with the microphone button

## Project Structure

```
orbit/
├── src/
│   ├── App.tsx                         # Main app entry
│   ├── main.tsx                        # React root
│   ├── index.css                       # Global styles
│   ├── types/
│   │   └── index.ts                    # Complete type definitions
│   ├── lib/
│   │   ├── store.ts                    # Zustand global state
│   │   ├── gemini.ts                   # Gemini API client
│   │   ├── speechRecognition.ts        # Web Speech API wrapper
│   │   ├── speechSynthesis.ts          # TTS wrapper
│   │   ├── offlineQueue.ts             # Offline request queue
│   │   └── utils.ts                    # Utility functions
│   ├── data/
│   │   ├── defaultPreferences.ts       # Default user settings
│   │   ├── greetingTemplates.ts        # Greeting messages
│   │   └── voiceProfiles.ts            # Voice configurations
│   ├── hooks/
│   │   ├── useOrbit.ts
│   │   ├── useVoice.ts
│   │   ├── useConversation.ts
│   │   ├── useCards.ts
│   │   ├── usePersonalization.ts
│   │   ├── useOffline.ts
│   │   └── useWakeWord.ts
│   ├── components/
│   │   ├── orbit/
│   │   │   ├── OrbitShell.tsx           # Main application container
│   │   │   ├── TheOrb.tsx               # Central pulsing orb
│   │   │   ├── Greeting.tsx             # Personalized greeting
│   │   │   └── SetupWizard.tsx          # First-time setup
│   │   ├── voice/
│   │   │   ├── VoiceInput.tsx           # Speech recognition
│   │   │   ├── VoiceOutput.tsx          # Text-to-speech
│   │   │   └── VoiceWaveform.tsx        # Audio visualization
│   │   ├── conversation/
│   │   │   ├── ConversationFlow.tsx     # Main conversation area
│   │   │   ├── MessageBubble.tsx        # User/AI messages
│   │   │   ├── ResponseCard.tsx         # AI response card
│   │   │   ├── CardGrid.tsx             # Multiple cards layout
│   │   │   └── FollowUpSuggestions.tsx  # Suggested next questions
│   │   ├── input/
│   │   │   ├── InputBar.tsx             # Bottom input area
│   │   │   └── ModeSelector.tsx         # Conversation mode picker
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx              # Slide-out sidebar
│   │   │   ├── ConversationHistory.tsx  # Past conversations
│   │   │   ├── SavedCards.tsx           # Bookmarked responses
│   │   │   ├── UserProfile.tsx          # Preferences display
│   │   │   └── PrivacyControls.tsx      # Data management
│   │   ├── cards/
│   │   │   ├── KnowledgeCard.tsx
│   │   │   ├── CodeCard.tsx
│   │   │   ├── StepsCard.tsx
│   │   │   ├── ComparisonCard.tsx
│   │   │   ├── CreativeCard.tsx
│   │   │   └── AnalysisCard.tsx
│   │   └── ui/
│   │       ├── GlowButton.tsx
│   │       ├── GlassPanel.tsx
│   │       ├── ParticleField.tsx
│   │       ├── AnimatedGradient.tsx
│   │       ├── PulseDot.tsx
│   │       ├── HolographicBorder.tsx
│   │       └── LoadingOrb.tsx
├── .env.example                        # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## License

MIT
