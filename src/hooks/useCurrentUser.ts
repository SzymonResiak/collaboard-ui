'use client';

import { create } from 'zustand';
import { User } from '@/types/user';

interface CurrentUserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useCurrentUser = create<CurrentUserStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user: User | null) => set({ user, isLoading: false }),
  fetchUser: async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      set({ user: data, isLoading: false, error: null });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        isLoading: false,
      });
    }
  },
}));
