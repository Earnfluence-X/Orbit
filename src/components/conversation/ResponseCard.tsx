import React from 'react';
import { motion } from 'framer-motion';
import { ResponseCard as ResponseCardType, CardCategory } from '@/types';
import { useStore } from '@/lib/store';
import { Bookmark, ChevronDown, ExternalLink } from 'lucide-react';

interface ResponseCardProps {
  card: ResponseCardType;
  index: number;
}

const categoryConfig: Record<
  CardCategory,
  { color: string; label: string }
> = {
  knowledge: { color: '#60a5fa', label: 'Knowledge' },
  news: { color: '#f472b6', label: 'News' },
  analysis: { color: '#a78bfa', label: 'Analysis' },
  creative: { color: '#fbbf24', label: 'Creative' },
  technical: { color: '#34d399', label: 'Technical' },
  comparison: { color: '#fb923c', label: 'Comparison' },
  steps: { color: '#38bdf8', label: 'Steps' },
  code: { color: '#4ade80', label: 'Code' },
  chart: { color: '#f87171', label: 'Chart' },
  personal: { color: '#c084fc', label: 'Personal' },
};

export const ResponseCard: React.FC<ResponseCardProps> = ({ card, index }) => {
  const { saveCard, removeCard, expandCard, savedCards } = useStore();
  const config = categoryConfig[card.category] || categoryConfig.knowledge;
  const isSaved = savedCards.some((c) => c.id === card.id);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer group mb-3"
      style={{
        background: `linear-gradient(135deg, ${config.color}11, ${config.color}05)`,
        border: `1px solid ${config.color}22`,
        backdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      whileHover={{ scale: 1.01, borderColor: `${config.color}44` }}
      onClick={() => expandCard(card.id)}
    >
      {/* Category indicator */}
      <div
        className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full text-xs"
        style={{ background: `${config.color}22`, color: config.color }}
      >
        <span className="capitalize">{config.label}</span>
      </div>

      {/* Save button */}
      <button
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/5 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          isSaved ? removeCard(card.id) : saveCard(card);
        }}
      >
        <Bookmark
          size={16}
          className={
            isSaved ? 'fill-current text-blue-400' : 'text-white/40'
          }
        />
      </button>

      {/* Content */}
      <div className="p-6 pt-12">
        <h3 className="text-lg font-medium text-white/90 mb-3">{card.title}</h3>

        {card.isExpanded ? (
          <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {card.content}
          </div>
        ) : (
          <p className="text-sm text-white/60 line-clamp-3">
            {card.summary || card.content}
          </p>
        )}

        {/* Sources */}
        {card.sources.length > 0 && card.isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-white/40 mb-2">Sources</p>
            {card.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 truncate"
              >
                <ExternalLink size={12} />
                {source.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Expand indicator */}
      {!card.isExpanded && (
        <div className="absolute bottom-2 right-3">
          <ChevronDown size={16} className="text-white/20" />
        </div>
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.color}11, transparent 60%)`,
        }}
      />
    </motion.div>
  );
};
