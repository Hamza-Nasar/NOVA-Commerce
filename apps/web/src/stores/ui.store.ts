'use client';

import { create } from 'zustand';

type UiState = {
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  authModalOpen: false,
  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),
}));
