import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Archive, Trash2, Bookmark } from 'lucide-react';

export const ConversationHistory: React.FC = () => {
  const {
    conversations,
    currentConversation,
    switchConversation,
    deleteConversation,
    saveConversation,
    archiveConversation,
    toggleSidebar,
  } = useStore();

  const activeConversations = conversations.filter((c) => !c.isArchived);

  if (activeConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/20 p-6">
        <MessageSquare size={32} />
        <p className="mt-2 text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {activeConversations.map((conv) => (
        <motion.div
          key={conv.id}
          className={`group relative px-4 py-3 cursor-pointer border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${
            currentConversation?.id === conv.id ? 'bg-white/[0.04]' : ''
          }`}
          onClick={() => {
            switchConversation(conv.id);
            toggleSidebar();
          }}
          whileHover={{ x: 2 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm text-white/70 truncate">{conv.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-white/20">
                  {formatDate(conv.date)}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.03] text-white/30 capitalize">
                  {conv.mode.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Hover actions */}
          <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveConversation(conv.id);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70"
            >
              <Bookmark
                size={14}
                className={conv.isSaved ? 'fill-current text-blue-400' : ''}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                archiveConversation(conv.id);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70"
            >
              <Archive size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
