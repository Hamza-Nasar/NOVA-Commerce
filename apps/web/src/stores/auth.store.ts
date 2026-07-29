'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, LoginInput, RegisterInput } from '@/lib/api/auth.api';
import { tokenStore } from '@/lib/api/client';
import { User } from '@/types/auth';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
      login: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(input);
          tokenStore.set(result.accessToken);
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false });
          throw error;
        }
      },
      register: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.register(input);
          tokenStore.set(result.accessToken);
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false });
          throw error;
        }
      },
      logout: async () => {
        await authApi.logout().catch(() => undefined);
        tokenStore.set(null);
        set({ user: null, isAuthenticated: false, error: null });
      },
      refresh: async () => {
        const result = await authApi.refresh();
        tokenStore.set(result.accessToken);
        set({ user: result.user, isAuthenticated: true });
      },
    }),
    {
      name: 'nova-auth-safe-state',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
