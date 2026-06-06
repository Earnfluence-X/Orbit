import React from 'react';
import { ResponseCard as ResponseCardType } from '@/types';

interface CodeCardProps {
  card: ResponseCardType;
}

export const CodeCard: React.FC<CodeCardProps> = ({ card }) => {
  const codeMatch = card.content.match(/```[\s\S]*?```/g);
  const codeBlocks = codeMatch
    ? codeMatch.map((b) => b.replace(/```\w*\n?/g, '').replace(/```/g, ''))
    : [card.content];

  return (
    <div>
      <h3 className="text-white/90 font-medium mb-3">{card.title}</h3>
      {codeBlocks.map((code, i) => (
        <pre
          key={i}
          className="bg-black/30 rounded-xl p-4 overflow-x-auto text-xs text-green-400/80 font-mono leading-relaxed border border-white/5"
        >
          <code>{code}</code>
        </pre>
      ))}
      {card.summary && (
        <p className="text-white/40 text-xs mt-2">{card.summary}</p>
      )}
    </div>
  );
};
