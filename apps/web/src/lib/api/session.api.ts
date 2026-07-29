import { authApi } from './auth.api';

export const sessionApi = {
  refresh: authApi.refresh,
  currentUser: authApi.me,
};
