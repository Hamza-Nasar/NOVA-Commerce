'use client';

import { create } from 'zustand';

type SessionState = {
  expired: boolean;
  markExpired: () => void;
  clearExpired: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  expired: false,
  markExpired: () => set({ expired: true }),
  clearExpired: () => set({ expired: false }),
}));
