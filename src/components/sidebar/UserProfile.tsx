import React from 'react';
import { useStore } from '@/lib/store';
import { User, Settings, BarChart3 } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, stats, updatePreferences } = useStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/20 p-6">
        <User size={32} />
        <p className="mt-2 text-sm">Complete setup to see your profile</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* User info */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-sm text-white/80 font-medium">{user.name}</h3>
          <p className="text-xs text-white/30">
            {user.languageStyle} style / {user.detailLevel} detail
          </p>
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className="text-xs text-white/30 mb-2">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="px-2 py-1 rounded-full text-xs bg-white/[0.03] border border-white/5 text-white/50"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
          <BarChart3 size={12} />
          Stats
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-lg text-white/60 font-medium">
              {stats.totalConversations}
            </p>
            <p className="text-[10px] text-white/20">Conversations</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-lg text-white/60 font-medium">
              {stats.savedCards}
            </p>
            <p className="text-[10px] text-white/20">Saved Cards</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-lg text-white/60 font-medium">
              {stats.queriesToday}
            </p>
            <p className="text-[10px] text-white/20">Queries Today</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-lg text-white/60 font-medium">
              {stats.quotaRemaining}
            </p>
            <p className="text-[10px] text-white/20">Remaining</p>
          </div>
        </div>
      </div>

      {/* Quick settings */}
      <div>
        <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
          <Settings size={12} />
          Quick Settings
        </p>
        <div className="space-y-2">
          <label className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/50">Auto-listen</span>
            <input
              type="checkbox"
              checked={user.autoListen}
              onChange={(e) =>
                updatePreferences({ autoListen: e.target.checked })
              }
              className="toggle"
            />
          </label>
          <label className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/50">Wake word</span>
            <input
              type="checkbox"
              checked={user.wakeWordEnabled}
              onChange={(e) =>
                updatePreferences({ wakeWordEnabled: e.target.checked })
              }
              className="toggle"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
