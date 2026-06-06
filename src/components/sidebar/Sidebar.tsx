import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ConversationHistory } from './ConversationHistory';
import { SavedCards } from './SavedCards';
import { UserProfile } from './UserProfile';
import { PrivacyControls } from './PrivacyControls';
import {
  MessageSquare,
  Bookmark,
  User,
  Shield,
  X,
  Plus,
} from 'lucide-react';

type SidebarTab = 'history' | 'saved' | 'profile' | 'privacy';

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    createConversation,
  } = useStore();
  const [activeTab, setActiveTab] = React.useState<SidebarTab>('history');

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'history', label: 'History', icon: <MessageSquare size={16} /> },
    { id: 'saved', label: 'Saved', icon: <Bookmark size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={16} /> },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-80 bg-[#0a0a1e]/95 border-r border-white/5 backdrop-blur-2xl z-50 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-medium text-white/80">ORBIT</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => createConversation()}
                  className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white/80 transition-colors"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white/80 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b border-blue-400'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'history' && <ConversationHistory />}
              {activeTab === 'saved' && <SavedCards />}
              {activeTab === 'profile' && <UserProfile />}
              {activeTab === 'privacy' && <PrivacyControls />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
