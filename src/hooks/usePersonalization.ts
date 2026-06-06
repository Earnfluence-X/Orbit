import { useCallback } from 'react';
import { useStore } from '@/lib/store';

export function usePersonalization() {
  const { user, updatePreferences } = useStore();

  const addInterest = useCallback(
    (interest: string) => {
      if (!user) return;
      const updated = [...user.interests, interest].filter(
        (v, i, a) => a.indexOf(v) === i
      );
      updatePreferences({ interests: updated });
    },
    [user, updatePreferences]
  );

  const removeInterest = useCallback(
    (interest: string) => {
      if (!user) return;
      updatePreferences({
        interests: user.interests.filter((i) => i !== interest),
      });
    },
    [user, updatePreferences]
  );

  return {
    user,
    updatePreferences,
    addInterest,
    removeInterest,
  };
}
