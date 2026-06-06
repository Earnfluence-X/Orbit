import React from 'react';
import { useStore } from '@/lib/store';
import { PrivacyMode } from '@/types';
import { Shield, Trash2, Download, Eye, EyeOff } from 'lucide-react';

export const PrivacyControls: React.FC = () => {
  const { privacyMode, setPrivacyMode, conversations, savedCards } =
    useStore();

  const modes: {
    id: PrivacyMode;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'standard',
      label: 'Standard',
      icon: <Eye size={14} />,
      description: 'Full conversation memory and personalization',
    },
    {
      id: 'private',
      label: 'Private',
      icon: <EyeOff size={14} />,
      description: 'Limited memory, no cross-session storage',
    },
    {
      id: 'incognito',
      label: 'Incognito',
      icon: <Shield size={14} />,
      description: 'Nothing saved, complete privacy',
    },
  ];

  const handleClearAll = () => {
    if (confirm('Delete all conversations and saved cards? This cannot be undone.')) {
      conversations.forEach((c) => useStore.getState().deleteConversation(c.id));
      savedCards.forEach((c) => useStore.getState().removeCard(c.id));
    }
  };

  const handleExport = () => {
    const data = {
      conversations: useStore.getState().conversations,
      savedCards: useStore.getState().savedCards,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Privacy modes */}
      <div>
        <p className="text-xs text-white/30 mb-2">Privacy Mode</p>
        <div className="space-y-1.5">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPrivacyMode(mode.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                privacyMode === mode.id
                  ? 'bg-blue-500/10 border border-blue-500/20'
                  : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
              }`}
            >
              <span
                className={
                  privacyMode === mode.id ? 'text-blue-400' : 'text-white/40'
                }
              >
                {mode.icon}
              </span>
              <div>
                <p className="text-sm text-white/70">{mode.label}</p>
                <p className="text-[10px] text-white/30">
                  {mode.description}
                </p>
              </div>
              {privacyMode === mode.id && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <p className="text-xs text-white/30 mb-2">Data Management</p>
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
        >
          <Download size={14} />
          Export all data
        </button>
        <button
          onClick={handleClearAll}
          className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={14} />
          Clear all data
        </button>
      </div>
    </div>
  );
};
