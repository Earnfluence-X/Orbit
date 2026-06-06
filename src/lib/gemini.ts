import {
  ResponseCard,
  CardCategory,
  ConversationContext,
  Message,
} from '@/types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildSystemPrompt = (
  context: ConversationContext,
  mode: string
): string => {
  const modePrompts: Record<string, string> = {
    quick:
      'Provide a concise, direct answer. Keep it brief but complete. Use bullet points for clarity.',
    deep_dive:
      'Provide a comprehensive, detailed analysis. Include background, context, multiple perspectives, and deep insights.',
    brainstorm:
      'Generate creative, diverse ideas. Think laterally. Encourage exploration. Suggest unconventional approaches.',
    learning:
      'Structure your response as an educational lesson. Include key concepts, examples, and check for understanding.',
    briefing:
      'Provide a summarized overview. Highlight the most important points. Keep it scannable.',
  };

  return `You are ORBIT, a futuristic AI assistant speaking to ${context.userName}.
Your personality is warm, intelligent, and slightly futuristic.
You communicate in a natural, conversational tone.

USER CONTEXT:
- Name: ${context.userName}
- Time: ${context.timeOfDay} on ${context.dateContext}
- Conversation Mode: ${mode}
- Detail Level: ${context.preferences.detailLevel}
- Interests: ${context.preferences.interests.join(', ')}
- Language Style: ${context.preferences.languageStyle}

RESPONSE FORMAT:
${modePrompts[mode] || modePrompts.quick}

After your response text, include:
---CARDS---
[Generate 1-4 structured information cards in JSON format. Each card should have:
{
  "category": "knowledge|news|analysis|creative|technical|comparison|steps|code|chart",
  "title": "Card title",
  "content": "Detailed card content",
  "summary": "One-line summary",
  "sources": [{"title": "Source", "url": "https://...", "publisher": "Publisher", "date": "date"}]
}]
---SUGGESTIONS---
[Generate 3 follow-up questions the user might want to ask next]
---END---

IMPORTANT: Today's date is ${context.dateContext}. Use current, accurate information.`;
};

const parseStructuredResponse = (
  rawText: string
): { text: string; cards: ResponseCard[]; suggestions: string[] } => {
  let text = rawText;
  let cards: ResponseCard[] = [];
  let suggestions: string[] = [];

  const cardsMatch = rawText.match(
    /---CARDS---\s*([\s\S]*?)\s*---SUGGESTIONS---/
  );
  if (cardsMatch) {
    try {
      const cardsText = cardsMatch[1].trim();
      const jsonMatch = cardsText.match(/\[([\s\S]*?)\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        cards = parsed.map(
          (card: Record<string, unknown>, index: number) => ({
            id: `card_${Date.now()}_${index}`,
            category: (card.category as CardCategory) || 'knowledge',
            title: (card.title as string) || '',
            content: (card.content as string) || '',
            summary: (card.summary as string) || '',
            media: null,
            sources: (card.sources as ResponseCard['sources']) || [],
            actions: [],
            isExpanded: false,
            isSaved: false,
          })
        );
      }
      text = rawText.split('---CARDS---')[0].trim();
    } catch {
      // Cards parsing failed, just use text
    }
  }

  const suggestionsMatch = rawText.match(
    /---SUGGESTIONS---\s*([\s\S]*?)\s*---END---/
  );
  if (suggestionsMatch) {
    suggestions = suggestionsMatch[1]
      .split('\n')
      .map((s) => s.replace(/^[\d.\-\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 4);
    text = text.split('---SUGGESTIONS---')[0].trim();
  }

  if (cards.length === 0) {
    cards = [
      {
        id: `card_${Date.now()}_0`,
        category: 'knowledge',
        title: 'Response',
        content: text,
        summary: text.substring(0, 100),
        media: null,
        sources: [],
        actions: [],
        isExpanded: false,
        isSaved: false,
      },
    ];
  }

  return { text, cards, suggestions };
};

export const sendToGemini = async (
  query: string,
  context: ConversationContext,
  conversationHistory: Message[],
  mode: string
): Promise<{
  text: string;
  cards: ResponseCard[];
  suggestions: string[];
}> => {
  const systemPrompt = buildSystemPrompt(context, mode);

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: msg.content,
    })),
    { role: 'user' as const, content: query },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: mode === 'brainstorm' ? 0.9 : mode === 'learning' ? 0.5 : 0.7,
      max_tokens: mode === 'deep_dive' ? 4096 : 2048,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Groq API error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '';
  return parseStructuredResponse(rawText);
};