import { api } from './client';
import { Address, User } from '@/types/auth';

export type ProfileInput = { firstName?: string; lastName?: string; phone?: string; profileImage?: string };
export type PasswordInput = { currentPassword: string; newPassword: string };
export type AddressInput = Omit<Address, 'id' | 'createdAt' | 'postalCode' | 'addressLine2' | 'isDefault'> & {
  postalCode?: string;
  addressLine2?: string;
  isDefault?: boolean;
};

export const userApi = {
  updateProfile: (input: ProfileInput) => api.patch<User>('/users/profile', input),
  changePassword: (input: PasswordInput) => api.patch<{ passwordChanged: boolean }>('/users/change-password', input),
  addresses: () => api.get<Address[]>('/users/addresses'),
  createAddress: (input: AddressInput) => api.post<Address>('/users/addresses', input),
  updateAddress: (id: string, input: Partial<AddressInput>) => api.patch<Address>(`/users/addresses/${id}`, input),
  deleteAddress: (id: string) => api.delete<{ deleted: boolean }>(`/users/addresses/${id}`),
};
