import { api } from './client';
import { AuthResponse, User } from '@/types/auth';

export type RegisterInput = { firstName: string; lastName: string; email: string; phone?: string; password: string };
export type LoginInput = { email: string; password: string };

export const authApi = {
  register: (input: RegisterInput) => api.post<AuthResponse>('/auth/register', input),
  login: (input: LoginInput) => api.post<AuthResponse>('/auth/login', input),
  logout: (refreshToken?: string) => api.post<{ loggedOut: boolean }>('/auth/logout', { refreshToken }),
  refresh: (refreshToken?: string) => api.post<AuthResponse>('/auth/refresh', { refreshToken }),
  me: () => api.get<User>('/auth/me'),
  forgotPassword: (email: string) => api.post<{ accepted: boolean }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.patch<{ accepted: boolean }>('/auth/reset-password', { token, password }),
};
