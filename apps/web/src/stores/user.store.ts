'use client';

import { create } from 'zustand';
import { userApi, AddressInput, PasswordInput, ProfileInput } from '@/lib/api/user.api';
import { Address, User } from '@/types/auth';

type UserState = {
  profile: User | null;
  addresses: Address[];
  loading: boolean;
  updateProfile: (input: ProfileInput) => Promise<User>;
  changePassword: (input: PasswordInput) => Promise<void>;
  loadAddresses: () => Promise<void>;
  createAddress: (input: AddressInput) => Promise<void>;
  updateAddress: (id: string, input: Partial<AddressInput>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  addresses: [],
  loading: false,
  updateProfile: async (input) => {
    set({ loading: true });
    const profile = await userApi.updateProfile(input);
    set({ profile, loading: false });
    return profile;
  },
  changePassword: async (input) => {
    set({ loading: true });
    await userApi.changePassword(input);
    set({ loading: false });
  },
  loadAddresses: async () => {
    set({ loading: true });
    const addresses = await userApi.addresses();
    set({ addresses, loading: false });
  },
  createAddress: async (input) => {
    set({ loading: true });
    await userApi.createAddress(input);
    const addresses = await userApi.addresses();
    set({ addresses, loading: false });
  },
  updateAddress: async (id, input) => {
    set({ loading: true });
    await userApi.updateAddress(id, input);
    const addresses = await userApi.addresses();
    set({ addresses, loading: false });
  },
  deleteAddress: async (id) => {
    set({ loading: true });
    await userApi.deleteAddress(id);
    const addresses = await userApi.addresses();
    set({ addresses, loading: false });
  },
}));
